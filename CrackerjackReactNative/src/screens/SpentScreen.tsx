import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { isUndefined } from 'lodash';
import { database } from '../..';

import { paymentFrequencies } from '../constants/time';
import LayoutDefault from './LayoutDefault';
import { brandStyles } from '../components/BrandStyles';

import { DatePickerInput } from 'react-native-paper-dates';
import Dropdown, { DropdownOptionInterface } from '../components/forms/Dropdown';
import TextInput from '../components/forms/TextInput';
import Decimal from '../components/forms/Decimal';
import Numeric from '../components/forms/Numeric';
import Submit from '../components/forms/Submit';
import Switch from '../components/forms/Switch';

import { Expense } from '../store/models/Expense';
import { Forecast } from '../store/models/Forecast';

interface propsInterface {
    navigation: any
}

const SpentScreen = ({ navigation }: propsInterface) => {

    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [frequency, setFrequency] = useState<DropdownOptionInterface>(paymentFrequencies.getDefault());
    const [isIndefinite, setIsIndefinite] = useState<boolean>(true);
    const [paymentsCount, setPaymentsCount] = useState<number>(1);
    const [total, setTotal] = useState<number>(0.00);
    const [firstPaymentDate, setFirstPaymentDate] = useState<Date>(new Date());

    useEffect(() => {
        setTotal(() => {
            let _total = parseFloat(`${amount}`) * parseFloat(`${paymentsCount}`);
            return _total;
        });
    }, [amount, paymentsCount, frequency])

    const processSubmit = async () => {

        if (description.length < 1) {
            Alert.alert('Description is empty');
            return;
        }

        if (amount <= 0) {
            Alert.alert('Amount is empty');
            return;
        }


        try {
            let expense: Expense | undefined;
            await database.write(async () => {
                expense = await database.get<Expense>(Expense.table).create((expense: Expense) => {
                    expense.paymentAmount = parseFloat(`${amount}`);
                    expense.expenseTotal = parseFloat(`${total}`);
                    expense.paymentCount = parseFloat(`${paymentsCount}`);
                    expense.paymentFrequency = frequency.value;
                    expense.description = description;
                    expense.firstPaymentDate = firstPaymentDate;
                    expense.createdDate = new Date();
                    expense.isRecurring = isRecurring;
                    expense.isIndefinite = isIndefinite;
                }) as Expense;
            });

            if (!isUndefined(expense)) {
                await expense.createForecast();
                await Forecast.generateRunningBalance();
            }
        } catch (error) {
            console.log('error while trying to write: ', error);
        }

        navigation.goBack();

    }

    return (
        <LayoutDefault title="Spending" navigation={navigation}>
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={spentStyles.container}>

                <TextInput label="Spent on what?" value={description} onChangeText={setDescription}></TextInput>

                <Decimal label="Amount" value={amount} onChangeText={setAmount} />

                <View style={{ ...(isRecurring ? { ...spentStyles.recurringContainer } : {}) }}>

                    <Switch
                        style={spentStyles.recurringSwitch}
                        label="Recurring Expenditure?"
                        onValueChange={setIsRecurring}
                        onTrueContent={<View>

                            <Dropdown label="" value={frequency}
                                options={paymentFrequencies.getDropdownOptions()}
                                onChangeSelect={(_value: DropdownOptionInterface) => setFrequency(_value)} />

                            <DatePickerInput
                                style={spentStyles.recurringInput}
                                mode="outlined"
                                locale="en"
                                label="First Payment Date"
                                value={firstPaymentDate}
                                onChange={(d) => setFirstPaymentDate(d ?? firstPaymentDate)}
                                inputMode="start"
                            />

                        </View>}
                    ></Switch>

                    {isRecurring && <Switch
                        label="Until further notice?"
                        value={isIndefinite}
                        onValueChange={setIsIndefinite}
                        onFalseContent={<>
                            <Numeric label="Number of Payments" value={paymentsCount} onChangeText={setPaymentsCount} />
                            <Decimal label="Total" value={total} onChangeText={() => { }} readOnly />
                        </>}
                    />}

                </View>

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
        marginVertical: 15,
        borderRadius: 8,
    },
    recurringContainer: {
        ...brandStyles.defaultBorder,
        marginVertical: 10,
        paddingHorizontal: 15
    },
    recurringInput: {
        marginVertical: 5
    }
});

export default SpentScreen;
