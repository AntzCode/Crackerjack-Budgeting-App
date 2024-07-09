import { get, has, isNull } from 'lodash';

import { add } from 'date-fns';

import { Expense } from "./Expense";
import { Income } from "./Income";
import { getFrequencyMultiplier } from '../../constants/time';
import { createRecord, db } from '../database';

export const tablename: string = 'forecast';
export const idColumnName: string = 'forecastId';

export class Forecast {
    forecastId?: number;
    amount: number = 0;
    balance: number = 0;
    description: string = '';
    date: Date = new Date();
    expenseId?: number;
    incomeId?: number;
    paymentCount: number = 1;
    loadFromPayment(payment: Expense | Income) {
        this.amount = payment.paymentAmount;
        this.description = payment.description;
        this.date = payment.firstPaymentDate;
        if (get(payment, 'expenseId')) {
            this.expenseId = get(payment, 'expenseId') as number;
        } else if (has(payment, 'incomeId')) {
            this.incomeId = get(payment, 'incomeId') as number;
        }
    }
}

export const generateForecastsRunningBalance = async (openingBalance: number) => {
    return new Promise(async (resolve, reject) => {
        
        // set the balance of the first row based on the provided openingBalance and the row amount
        (await db).transaction((txn: any) => txn.executeSql("SELECT `forecastId`, `amount`, `expenseId`, `incomeId` FROM `forecast` ORDER BY `date` ASC LIMIT 1", [], async (status: any, data: any) => {
            let row = data.rows.item(0);
            let rowOpeningBalance = openingBalance;
            if (!isNull(get(row, 'expenseId'))) {
                rowOpeningBalance = rowOpeningBalance - row['amount'];
            } else if (!isNull(get(row, 'incomeId'))) {
                rowOpeningBalance = rowOpeningBalance + row['amount'];
            }
            return await txn.executeSql("UPDATE `forecast` SET `balance` = ? WHERE `forecastId` = ?", [rowOpeningBalance, row['forecastId']]);
        }, () => { }));

        // set the balance of all subsequent rows
        (await db).transaction((txn: any) => txn.executeSql("SELECT `forecastId`, `date`, `amount`, `balance`, `expenseId`, `incomeId` FROM `forecast` ORDER BY `date` ASC, `forecastId` ASC", [],
            async (status: any, data: any) => {
                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows.item(i);
                    let query = "UPDATE `forecast` SET `balance` = (SELECT `balance` {operator} ? FROM `forecast` WHERE `date` <= ? AND `forecastId` != ? ORDER BY `date` DESC LIMIT 1) WHERE `forecastId` = ?";
                    let params: any = [];
                    if (!isNull(get(row, 'expenseId'))) {
                        params = [get(row, 'amount'), get(row, 'date'), get(row, 'forecastId'), get(row, 'forecastId')];
                        (await db).transaction((txn2: any) => txn2.executeSql(query.replace('{operator}', '-'), params));
                    } else if (!isNull(get(row, 'incomeId'))) {
                        params = [get(row, 'amount'), get(row, 'date'), get(row, 'forecastId'), get(row, 'forecastId')];
                        (await db).transaction((txn2: any) => txn2.executeSql(query.replace('{operator}', '+'), params));
                    }
                }
                resolve(1);
            }, (error: any) => { reject(error) })
        );
    });

}

export const generateForecasts = async (payment: Expense | Income): Promise<Forecast[]> => {

    let paymentTypeColumnName = (has(payment, 'expenseId')) ? 'expenseId' : (has(payment, 'incomeId')) ? 'incomeId' : '';

    return new Promise(async (resolve, reject) => {
        (await db).transaction((txn: any) => {
            // delete existing forecasts of the same payment
            let query = "DELETE FROM `forecasts` WHERE `" + (paymentTypeColumnName) + "` = ?";
            txn.executeSql(query, [get(payment, paymentTypeColumnName)]);
        });

        let forecasts: Forecast[] = [];
        let paymentsCount = payment.paymentCount;
        if (!payment.isRecurring) {
            paymentsCount = 1;
        }

        if (payment.isIndefinite) {
            // we assume 5 years is the longest possible forecast
            paymentsCount = 5 * getFrequencyMultiplier(payment.paymentFrequency)
        }

        let firstPaymentDate = new Date(payment.firstPaymentDate);

        for (let i = 0; i < paymentsCount; i++) {
            let forecast = new Forecast();
            forecast.loadFromPayment(payment);
            forecast.paymentCount = i + 1;
            switch (payment.paymentFrequency) {
                case 'd':
                    forecast.date = add(firstPaymentDate, { days: i });
                    break;
                case 'w':
                    forecast.date = add(firstPaymentDate, { weeks: i });
                    break;
                case 'f':
                    forecast.date = add(firstPaymentDate, { weeks: i * 2 });
                    break;
                case 'm':
                    forecast.date = add(firstPaymentDate, { months: i });
                    break;
                case 'm2':
                    forecast.date = add(firstPaymentDate, { months: i * 2 });
                    break;
                case 'm3':
                    forecast.date = add(firstPaymentDate, { months: i * 3 });
                    break;
                case 'y':
                    forecast.date = add(firstPaymentDate, { years: i });
                    break;
            }
            await createRecord('forecast', 'forecastId', forecast);
            forecasts[forecasts.length] = forecast;
        }

        resolve(forecasts);

    });
}
