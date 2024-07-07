import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
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
import { SceneMap, TabView } from "react-native-tab-view";
import TabulatedData, { convertRecordset, RecordsetType } from "../components/TabulatedData";
import { getFrequencyTitle, sortByFrequency } from "../constants/time";
import { CurrencyFormat } from "../components/CurrencyFormat";
import { brandStyles } from "../components/BrandStyles";

interface propsInterface {
    navigation: any
}

const ScheduledPaymentsScreen = ({ navigation }: propsInterface) => {

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [redrawPage, setRedrawPage] = useState<number>(0);

    const layout = useWindowDimensions();

    const [tabRoutes] = useState([
        { key: 'income', title: 'Income' },
        { key: 'expenses', title: 'Expenses' },
    ]);

    const sortByPaymentFrequency = (modelA: Expense | Income, modelB: Expense | Income) => {
        return sortByFrequency({ frequency: modelA.paymentFrequency }, { frequency: modelB.paymentFrequency });
    }

    const filterIncomesByPaymentFrequency = (dataset: Income[], frequency: string) => {
        return [...dataset ?? []].filter((model: Income) => model.paymentFrequency === frequency);
    }

    const filterExpensesByPaymentFrequency = (dataset: Expense[], frequency: string) => {
        return [...dataset].filter((model: Expense) => model.paymentFrequency === frequency);
    }

    const RowFooterDetails = (props: any) => {
        const payment: Income | Expense = props.payment;

        const deleteIncome = async (income: Income) => {
            await db.transaction(async (txn: any) => {
                await txn.executeSql("UPDATE `income` SET `deletedDate` = ? WHERE `incomeId` = ?",
                    [formatDate(new Date(), 'yyyy-mm-dd HH:MM:ss'), income.incomeId],
                    () => { setRedrawPage((_x: number) => _x + 1) },
                    () => { }
                );
            });
            await db.transaction(async (txn: any) => {
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

        return <View><Text><Button onPress={() => deleteIncome(payment as Income)} text="Delete"></Button></Text></View>
    }

    const TabulatedIncomeGroup = ({ frequency, incomes }: any) => {
        const headerData = convertRecordset([{ Description: '', Amount: '' }]).headerData;
        const recordSet = convertRecordset(filterIncomesByPaymentFrequency(incomes, frequency).map((income: Income) => ({
            description: income.description,
            amount: <CurrencyFormat>{income.paymentAmount}</CurrencyFormat>,
            onPress: () => { },
            onLongPress: () => { },
            onShowFooter: <RowFooterDetails payment={income}></RowFooterDetails>
        })));

        return <TabulatedData headerData={headerData}
            bodyData={recordSet.bodyData}
            actions={recordSet.actions}
            rowFooters={recordSet.rowFooters}
            options={{accordionRowFooters: true}} />
    }

    const TabulatedExpenseGroup = ({ frequency, expenses }: any) => {
        const headerData = convertRecordset([{ Description: '', Amount: '' }]).headerData;
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
            options={{accordionRowFooters: true}} />
    }
    const IncomeRoute = () => {

        const [incomes, setIncomes] = useState<Income[]>([]);
        const [redrawPage, setRedrawPage] = useState<number>(0);

        const editIncome = (income: Income) => {

        }

        useEffect(() => {

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
                        setIncomes(items);
                    }, (error: any) => { console.log('error: ', error) })
            });

        }, [, redrawPage]);

        return <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={scheduledPaymentsStyles.container}>
            <>
                {filterIncomesByPaymentFrequency(incomes, 'd').length > 0 && <View key={'d'}>
                    <SectionHeading>Daily</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="d" />
                </View>}

                {filterIncomesByPaymentFrequency(incomes, 'w').length > 0 && <View key={'w'}>
                    <SectionHeading>Weekly</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="w" />
                </View>}

                {filterIncomesByPaymentFrequency(incomes, 'f').length > 0 && <View key={'f'}>
                    <SectionHeading>Fortnightly</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="f" />
                </View>}

                {filterIncomesByPaymentFrequency(incomes, 'm').length > 0 && <View key={'m'}>
                    <SectionHeading>Monthly</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="m" />
                </View>}

                {filterIncomesByPaymentFrequency(incomes, 'm2').length > 0 && <View key={'m2'}>
                    <SectionHeading>2-Monthly</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="m2" />
                </View>}

                {filterIncomesByPaymentFrequency(incomes, 'm3').length > 0 && <View key={'m3'}>
                    <SectionHeading>3-Monthly</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="m3" />
                </View>}

                {filterIncomesByPaymentFrequency(incomes, 'y').length > 0 && <View key={'y'}>
                    <SectionHeading>Yearly</SectionHeading>
                    <TabulatedIncomeGroup incomes={incomes} frequency="y" />
                </View>}

                <Button onPress={() => navigation.push('Earnt')} text="New Income"></Button>
            </>
        </ScrollView>

    };

    const ExpensesRoute = () => {

        const [redrawPage, setRedrawPage] = useState<number>(0);
        const [expenses, setExpenses] = useState<Expense[]>([]);
        const [sortingSection, setSortingSection] = useState<string>('');
        const headerData = convertRecordset([{ Description: '', Amount: '' }]).headerData;

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

        }, [, redrawPage]);

        const editExpense = (expense: Expense) => {

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

        return <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={scheduledPaymentsStyles.container}>

            {expenses.length < 1 && <Text>There is no scheduled payments</Text>}


            {filterExpensesByPaymentFrequency(expenses, 'd').length > 0 && <View key={'d'}>
                    <SectionHeading>Daily</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="d" />
                </View>}

                {filterExpensesByPaymentFrequency(expenses, 'w').length > 0 && <View key={'w'}>
                    <SectionHeading>Weekly</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="w" />
                </View>}

                {filterExpensesByPaymentFrequency(expenses, 'f').length > 0 && <View key={'f'}>
                    <SectionHeading>Fortnightly</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="f" />
                </View>}

                {filterExpensesByPaymentFrequency(expenses, 'm').length > 0 && <View key={'m'}>
                    <SectionHeading>Monthly</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="m" />
                </View>}

                {filterExpensesByPaymentFrequency(expenses, 'm2').length > 0 && <View key={'m2'}>
                    <SectionHeading>2-Monthly</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="m2" />
                </View>}

                {filterExpensesByPaymentFrequency(expenses, 'm3').length > 0 && <View key={'m3'}>
                    <SectionHeading>3-Monthly</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="m3" />
                </View>}

                {filterExpensesByPaymentFrequency(expenses, 'y').length > 0 && <View key={'y'}>
                    <SectionHeading>Yearly</SectionHeading>
                    <TabulatedExpenseGroup expenses={expenses} frequency="y" />
                </View>}

            <Button onPress={() => navigation.push('Spent')} text="New Expense"></Button>

        </ScrollView>
    };

    const renderScene = SceneMap({
        income: IncomeRoute,
        expenses: ExpensesRoute,
    });

    return (<>
        <TabView
            navigationState={{ index: tabIndex, routes: tabRoutes }}
            renderScene={renderScene}
            onIndexChange={setTabIndex}
            initialLayout={{ width: layout.width }}
        />
    </>)

}

export const scheduledPaymentsStyles = StyleSheet.create({
    container: {
        backgroundColor: brandStyles.light.backgroundColor
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


export default ScheduledPaymentsScreen;

