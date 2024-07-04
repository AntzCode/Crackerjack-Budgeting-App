import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import LayoutDefault from './LayoutDefault';
import { brandStyles } from '../components/BrandStyles';
import Dropdown, { DropdownOptionInterface } from '../components/forms/Dropdown';
import Decimal from '../components/forms/Decimal';
import Numeric from '../components/forms/Numeric';
import Submit from '../components/forms/Submit';
import Switch from '../components/forms/Switch';
import TextInput from '../components/forms/TextInput';

import { Income, tablename as incomeTablename, idColumnName as incomeIdColumnName } from '../store/models/Income';
import { getCurrentBalance } from '../store/models/Transaction';
import { generateForecasts, generateForecastsRunningBalance } from '../store/models/Forecast';
import { createRecord } from '../store/database';
import { paymentFrequencies } from '../constants/time';

interface propsInterface {
    navigation: any
}

const EarntScreen = ({ navigation }: propsInterface) => {

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

        let income = new Income();

        income.paymentAmount = parseFloat(`${amount}`);
        income.incomeTotal = parseFloat(`${total}`);
        income.paymentCount = parseFloat(`${paymentsCount}`);
        income.paymentFrequency = frequency.value;
        income.description = description;
        income.firstPaymentDate = firstPaymentDate;
        income.createdDate = new Date();
        income.isRecurring = isRecurring;
        income.isIndefinite = isIndefinite;

        let result = await createRecord(incomeTablename, incomeIdColumnName, income);
        income.incomeId = result.insertId;

        let balance = await getCurrentBalance();

        await generateForecasts(income);
        await generateForecastsRunningBalance(balance);

        navigation.goBack();

        // let transaction = new Transaction();
        // transaction.date = income.createdDate;
        // transaction.description = income.description;
        // transaction.amount = income.paymentAmount;
        // transaction.balance = parseFloat(`${balance}`) + parseFloat(`${income.paymentAmount}`);
        // transaction.expenseId = result.results.insertId;

        // createRecord(transactionTablename, transactionIdColumnName, transaction);


    }

    return (
        <LayoutDefault title="Earning" navigation={navigation}>
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={spentStyles.container}>

                <TextInput label="From what?" value={description} onChangeText={setDescription}></TextInput>

                <Decimal label="Amount" value={amount} onChangeText={setAmount} />

                <Switch
                    style={spentStyles.recurringSwitch}
                    label="Recurring Income?"
                    onValueChange={setIsRecurring}
                    onTrueContent={<View>
                        <TextInput label="First Payment Date" value={firstPaymentDate.toISOString()} onChangeText={(_value: string) => setFirstPaymentDate(new Date(_value))} />

                        <Dropdown label="" value={frequency}
                            options={paymentFrequencies.getDropdownOptions()}
                            onChangeSelect={(_value: DropdownOptionInterface) => setFrequency(_value)} />

                        <Switch
                            label="Until further notice?"
                            value={isIndefinite}
                            onValueChange={(value: boolean) => setIsIndefinite(value)}

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
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: brandStyles.subtle.backgroundColor,
        color: brandStyles.subtle.color,
    }
});

export default EarntScreen;
