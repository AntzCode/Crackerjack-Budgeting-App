import { Model, Q } from '@nozbe/watermelondb'
import { field, text, date, relation } from '@nozbe/watermelondb/decorators'

import { database } from '../../..';

export class Forecast extends Model {
    static table = 'forecast'

    @field('amount') amount
    @field('balance') balance
    @text('description') description
    @date('date') date
    @field('payment_count') paymentCount
    @relation('expense', 'expense_id') expense
    @relation('income', 'income_id') income

    static async generateRunningBalance(openingBalance: number = 0) {
        let iterations = 0;
        let runningBalance = openingBalance;
        (await database.collections.get<Forecast>('forecast').query(Q.sortBy('date', Q.asc))).
            map(forecast => forecast.prepareUpdate((forecast: Forecast) => {
                runningBalance = forecast.income.id
                    ? runningBalance + forecast.amount
                    : runningBalance - forecast.amount
                    ;
                forecast.balance = runningBalance;
                iterations++;
            }));
    }

}
