
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, FAB, Icon, Text, TouchableRipple } from 'react-native-paper';
import { get, set } from 'lodash';
import { formatDate } from "date-fns";

import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";
import { brandStyles } from "../components/BrandStyles";

import { generateForecastsRunningBalance } from "../store/models/Forecast";
import { getCurrentBalance } from "../store/models/Transaction";
import { Expense } from "../store/models/Expense";
import { Income } from "../store/models/Income";

import { db } from "../store/database";

interface propsInterface {
    navigation: any
}

export const ExpensesScreen = ({ navigation }: propsInterface) => {

    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        setTimeout(async () => {
            (await db).transaction((txn: any) => {
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
        });

    }, []);

    const filterExpensesByPaymentFrequency = (dataset: Expense[], frequency: string) => {
        return [...dataset].filter((model: Expense) => model.paymentFrequency === frequency);
    }

    const RowFooterDetails = (props: any) => {
        const payment: Income | Expense = props.payment;

        const deleteExpense = async (expense: Expense) => {
            (await db).transaction(async (txn: any) => {
                await txn.executeSql("UPDATE `expense` SET `deletedDate` = ? WHERE `expenseId` = ?",
                    [formatDate(new Date(), 'yyyy-mm-dd HH:MM:ss'), expense.expenseId],
                    () => { },
                    () => { }
                );
            });
            (await db).transaction(async (txn: any) => {
                await txn.executeSql("DELETE FROM `forecast` WHERE `expenseId` = ?",
                    [expense.expenseId],
                    async () => {
                        await generateForecastsRunningBalance(await getCurrentBalance());
                    },
                    () => { }
                );
            });
        }

        return <TouchableRipple style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center'
        }} onPress={() => deleteExpense(payment as Expense)}>
            <Icon source="trash-can"
                color={brandStyles.dangerButton.backgroundColor}
                size={30} />
        </TouchableRipple>
    }

    const TabulatedExpenseGroup = ({ frequency, expenses }: any) => {
        const headerData = false;// convertRecordset([{ Description: '', Amount: '' }]).headerData;
        const recordSet = convertRecordset(filterExpensesByPaymentFrequency(expenses, frequency).map((expense: Expense) => ({
            description: expense.description,
            amount: <CurrencyFormat>{expense.paymentAmount}</CurrencyFormat>,
            onPress: () => { },
            onLongPress: () => { },
            onShowFooter: <RowFooterDetails payment={expense}></RowFooterDetails>
        })));

        return <TabulatedData headerData={headerData}
            bodyData={recordSet.bodyData}
            actions={recordSet.actions}
            rowFooters={recordSet.rowFooters}
            options={{ accordionRowFooters: true }} />
    }

    return <>

        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={expensesStyles.container}>

            {expenses.length < 1 && <View key={'x'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Upcoming Payments" />
                    <Card.Content><Text>There is no scheduled payments</Text></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'd').length > 0 && <View key={'d'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Daily" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="d" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'w').length > 0 && <View key={'w'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Weekly" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="w" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'f').length > 0 && <View key={'f'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Fortnightly" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="f" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'm').length > 0 && <View key={'m'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Monthly" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="m" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'm2').length > 0 && <View key={'m2'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="2-Monthly" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="m2" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'm3').length > 0 && <View key={'m3'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="3-Monthly" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="m3" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

            {filterExpensesByPaymentFrequency(expenses, 'y').length > 0 && <View key={'y'}>
                <Card mode={`elevated`} style={expensesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Yearly" />
                    <Card.Content><TabulatedExpenseGroup expenses={expenses} frequency="y" /></Card.Content>
                </Card>
                <Divider style={expensesStyles.divider} />
            </View>}

        </ScrollView>

        <FAB variant="primary" color={brandStyles.primaryButton.color} icon={"plus"} style={expensesStyles.fab} onPress={() => navigation.push('Spent')} />

    </>
};

export const expensesStyles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 15,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: brandStyles.primaryButton.backgroundColor,
        color: brandStyles.primaryButton.color
    },
    container: {
        flex: 1,
    },
    card: {
        margin: 15,
    },
    divider: {
        marginVertical: 0
    },
    item: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10
    },
    itemText: {
        fontSize: 20
    }
});

export default ExpensesScreen;