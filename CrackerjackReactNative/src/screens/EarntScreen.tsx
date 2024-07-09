import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';

import LayoutDefault from './LayoutDefault';

import Dropdown, { DropdownOptionInterface } from '../components/forms/Dropdown';
import TextInput from '../components/forms/TextInput';
import Decimal from '../components/forms/Decimal';
import Numeric from '../components/forms/Numeric';
import Submit from '../components/forms/Submit';
import Switch from '../components/forms/Switch';

import { Income, tablename as incomeTablename, idColumnName as incomeIdColumnName } from '../store/models/Income';
import { getCurrentBalance } from '../store/models/Transaction';
import { generateForecasts, generateForecastsRunningBalance } from '../store/models/Forecast';

import { createRecord } from '../store/database';
import { paymentFrequencies } from '../constants/time';
import { brandStyles } from '../components/BrandStyles';

interface propsInterface {
    navigation: any
}

const EarntScreen = ({ navigation }: propsInterface) => {

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

        let income = new Income();

        if (description.length < 1) {
            Alert.alert('Description is empty');
            return;
        }

        if (amount <= 0) {
            Alert.alert('Amount is empty');
            return;
        }

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

    }

    return (
        <LayoutDefault title="Earning" navigation={navigation}>
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={earntStyles.container}>

                <TextInput label="From what?" value={description} onChangeText={setDescription}></TextInput>

                <Decimal label="Amount" value={amount} onChangeText={setAmount} />

                <View style={{ ...(isRecurring ? { ...earntStyles.recurringContainer } : {}) }}>

                    <Switch
                        style={earntStyles.recurringSwitch}
                        label="Recurring Income?"
                        onValueChange={setIsRecurring}
                        onTrueContent={<View>

                            <Dropdown label="" value={frequency}
                                style={earntStyles.recurringInput}
                                options={paymentFrequencies.getDropdownOptions()}
                                onChangeSelect={(_value: DropdownOptionInterface) => setFrequency(_value)} />

                            <DatePickerInput
                                style={earntStyles.recurringInput}
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
                        style={{
                            padding: 0,
                            margin: 0,
                            marginHorizontal: 0,
                            paddingHorizontal: 0,

                        }}
                        label="Until further notice?"
                        value={isIndefinite}
                        onValueChange={(value: boolean) => setIsIndefinite(value)}
                        onFalseContent={<>
                            <Numeric label="Number of Payments"
                                value={paymentsCount}
                                onChangeText={setPaymentsCount}
                                style={earntStyles.recurringInput} />
                            <Decimal readOnly label="Total"
                                value={total}
                                onChangeText={() => { }} />
                        </>}

                    />}

                </View>

                <Submit submitText='Save' onSubmit={processSubmit} onCancel={() => navigation.goBack()} />

            </ScrollView>
        </LayoutDefault >

    )
}

const earntStyles = StyleSheet.create({
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

export default EarntScreen;
