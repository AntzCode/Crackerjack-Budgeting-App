import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { get, set } from 'lodash';
import { formatDate } from "date-fns";

import LayoutDefault from "./LayoutDefault";
import Card, { cardStyles } from "../components/Card";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/forms/Button";

import { generateForecastsRunningBalance } from "../store/models/Forecast";
import { getCurrentBalance } from "../store/models/Transaction";
import { Expense } from "../store/models/Expense";
import { Income } from "../store/models/Income";
import { db } from "../store/database";

interface propsInterface {
    navigation: any
}

const ScheduledPaymentsScreen = ({ navigation }: propsInterface) => {

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [income, setIncome] = useState<Income[]>([]);
    const [redrawPage, setRedrawPage] = useState<number>(0);

    const deleteIncome = async (income: Income) => {
        await db.transaction(async (txn: any) => {
            await txn.executeSql("UPDATE `income` SET `deletedDate` = ? WHERE `incomeId` = ?",
                [formatDate(new Date(), 'yyyy-mm-dd HH:MM:ss'), income.incomeId],
                () => { setRedrawPage((_x: number) => _x + 1) },
                () => { }
            );
            await txn.executeSql("DELETE FROM `forecast` WHERE `incomeId` = ?",
                [income.incomeId],
                async () => { 
                    await generateForecastsRunningBalance(await getCurrentBalance());
                    setRedrawPage((_x: number) => _x + 1); 
                },
                () => { }
            );
        });
    }

    const deleteExpense = async (expense: Expense) => {
        await db.transaction(async (txn: any) => {
            await txn.executeSql("UPDATE `expense` SET `deletedDate` = ? WHERE `expenseId` = ?",
                [formatDate(new Date(), 'yyyy-mm-dd HH:MM:ss'), expense.expenseId],
                () => { setRedrawPage((_x: number) => _x + 1) },
                () => { }
            );
            await txn.executeSql("DELETE FROM `forecast` WHERE `expenseId` = ?",
                [expense.expenseId],
                async () => { 
                    await generateForecastsRunningBalance(await getCurrentBalance());
                    setRedrawPage((_x: number) => _x + 1); 
                },
                () => { }
            );
            
        });
    }

    const editIncome = (income: Income) => {

    }

    const editExpense = (expense: Expense) => {

    }

    useEffect(() => {
        db.transaction((txn: any) => {
            txn.executeSql("SELECT * FROM `expense` WHERE `isRecurring` = 1 AND `deletedDate` IS NULL", [],
                (status: any, data: any) => {
                    let items: Expense[] = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows.item(i);
                        let expense = new Expense();
                        Object.keys(row).forEach((keyname: string) => {
                            set(expense, keyname, get(row, keyname));
                        });
                        items.push(expense);
                    }
                    setExpenses(items);
                }, (error: any) => { console.log('error: ', error) })
        });
        db.transaction((txn: any) => {
            txn.executeSql("SELECT * FROM `income` WHERE `isRecurring` = 1 AND `deletedDate` IS NULL", [],
                (status: any, data: any) => {
                    let items: Income[] = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows.item(i);
                        let income = new Income();
                        Object.keys(row).forEach((keyname: string) => {
                            set(income, keyname, get(row, keyname));
                        });
                        items.push(income);
                    }
                    setIncome(items);
                }, (error: any) => { console.log('error: ', error) })
        });

    }, [, redrawPage]);

    return (<LayoutDefault title="Spending" navigation={navigation}>
        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={scheduledPaymentsStyles.container}>

            <SectionHeading>Expenses</SectionHeading>

            {expenses.length < 1 && <Text>There is no scheduled payments</Text>}

            {expenses.map((expense: Expense) => <Card key={expense.expenseId}
                title={<>
                    <Text style={cardStyles.titleText}>{expense.description}</Text>
                    <Text style={cardStyles.titleText}>${JSON.stringify(expense.deletedDate)}</Text>
                    <Text style={cardStyles.titleText}>${expense.expenseTotal}</Text>
                </>}
                footer={<>
                    <Button onPress={() => deleteExpense(expense)} text="Delete"></Button>
                    <Button onPress={() => editExpense(expense)} text="Edit"></Button>

                </>}
            />)}

            <Button onPress={() => navigation.push('Spent')} text="New Expense"></Button>

            <SectionHeading>Income</SectionHeading>
            {income.length < 1 && <Text>There is no scheduled income</Text>}
            {income.map((income: Income) => <Card key={income.incomeId}
                title={<>
                    <Text style={cardStyles.titleText}>{income.description}</Text>
                    <Text style={cardStyles.titleText}>${JSON.stringify(income.deletedDate)}</Text>
                    <Text style={cardStyles.titleText}>${income.incomeTotal}</Text>
                </>}
                footer={<>
                    <Button onPress={() => deleteIncome(income)} text="Delete"></Button>
                    <Button onPress={() => editIncome(income)} text="Edit"></Button>

                </>}
            />)}
            <Button onPress={() => navigation.push('Earnt')} text="New Income"></Button>
        </ScrollView>
    </LayoutDefault>)

}

export const scheduledPaymentsStyles = StyleSheet.create({
    container: {

    },
    item: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        margin: 10,
        padding: 10
    },
    itemText: {
        fontSize: 20
    }
});


export default ScheduledPaymentsScreen;

