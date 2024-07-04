import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import LayoutDefault from './LayoutDefault';
import { brandStyles } from '../components/BrandStyles';

import Decimal from '../components/forms/Decimal';
import Dropdown, { DropdownOptionInterface } from '../components/forms/Dropdown';
import Numeric from '../components/forms/Numeric';
import Submit from '../components/forms/Submit';
import Switch from '../components/forms/Switch';
import TextInput from '../components/forms/TextInput';

import { Expense, tablename as expenseTablename, idColumnName as expenseIdColumnName } from '../store/models/Expense';
import { getCurrentBalance } from '../store/models/Transaction';
import { generateForecasts, generateForecastsRunningBalance } from '../store/models/Forecast';

import { paymentFrequencies } from '../constants/time';
import { createRecord } from '../store/database';

interface propsInterface {
    navigation: any
}

const SpentScreen = ({ navigation }: propsInterface) => {

    const isDarkMode = useColorScheme() === 'dark';

    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [frequency, setFrequency] = useState<DropdownOptionInterface>(paymentFrequencies.getDefault());
    const [isIndefinite, setIsIndefinite] = useState<boolean>(true);
    const [paymentsCount, setPaymentsCount] = useState<number>(1);
    const [total, setTotal] = useState<number>(0.00);
    // @TODO: user locale configuration
    const [firstPaymentDate, setFirstPaymentDate] = useState<Date>(new Date());

    useEffect(() => {
        setTotal(() => {
            let _total = parseFloat(`${amount}`) * parseFloat(`${paymentsCount}`);
            return _total;
        });
    }, [amount, paymentsCount, frequency])

    const processSubmit = async () => {

        let expense = new Expense();

        expense.paymentAmount = parseFloat(`${amount}`);
        expense.expenseTotal = parseFloat(`${total}`);
        expense.paymentCount = parseFloat(`${paymentsCount}`);
        expense.paymentFrequency = frequency.value;
        expense.description = description;
        expense.firstPaymentDate = firstPaymentDate;
        expense.createdDate = new Date();
        expense.isRecurring = isRecurring;
        expense.isIndefinite = isIndefinite;

        let result = await createRecord(expenseTablename, expenseIdColumnName, expense);
        expense.expenseId = result.insertId;

        let balance = await getCurrentBalance();

        await generateForecasts(expense);
        await generateForecastsRunningBalance(balance);

        navigation.goBack();

        // let transaction = new Transaction();
        // transaction.date = expense.createdDate;
        // transaction.description = expense.description;
        // transaction.amount = expense.paymentAmount;
        // transaction.balance = balance - expense.paymentAmount;
        // transaction.expenseId = result.results.insertId;

        // createRecord(transactionTablename, transactionIdColumnName, transaction);

    }

    return (
        <LayoutDefault title="Spending" navigation={navigation}>
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={spentStyles.container}>

                <TextInput label="Spent on what?" value={description} onChangeText={setDescription}></TextInput>

                <Decimal label="Amount" value={amount} onChangeText={setAmount} />

                <Switch
                    style={spentStyles.recurringSwitch}
                    label="Recurring Expenditure?"
                    onValueChange={setIsRecurring}
                    onTrueContent={<View>
                        <TextInput label="First Payment Date" value={firstPaymentDate.toISOString()} onChangeText={(_value: string) => setFirstPaymentDate(new Date(_value))} />

                        <Dropdown label="" value={frequency}
                            options={paymentFrequencies.getDropdownOptions()}
                            onChangeSelect={(_value: DropdownOptionInterface) => setFrequency(_value)} />

                        <Switch
                            label="Until further notice?"
                            value={isIndefinite}
                            onValueChange={setIsIndefinite}

                        />

                        {!isIndefinite && <>
                            <Numeric label="Number of Payments" value={paymentsCount} onChangeText={setPaymentsCount} />
                            <Decimal label="Total" value={total} onChangeText={() => { }} readOnly />
                        </>}

                    </View>}
                ></Switch>

                <Submit submitText='Save' onSubmit={processSubmit} onCancel={() => navigation.goBack()} />

            </ScrollView>
        </LayoutDefault >

    )
}

const spentStyles = StyleSheet.create({
    container: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    recurringSwitch: {
        // borderWidth: 1,
        // borderColor: 'gray',
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: brandStyles.subtle.backgroundColor,
        color: brandStyles.subtle.color,
    }
});

export default SpentScreen;
