import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { brandStyles } from '../components/BrandStyles';
import Decimal from '../components/forms/Decimal';
import Dropdown, { DropdownOptionInterface } from '../components/forms/Dropdown';
import Numeric from '../components/forms/Numeric';
import Submit from '../components/forms/Submit';
import Switch from '../components/forms/Switch';
import TextInput from '../components/forms/TextInput';
import { paymentFrequencies } from '../constants/time';
import LayoutDefault from './LayoutDefault';

interface propsInterface {
    navigation: any
}

const defaultProps = {
}

const SpentScreen = ({ navigation }: propsInterface) => {

    const isDarkMode = useColorScheme() === 'dark';

    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [frequency, setFrequency] = useState<DropdownOptionInterface>(paymentFrequencies.getDefault());
    const [isUnlimitedPaymentsCount, setIsUnlimitedPaymentsCount] = useState<boolean>(true);
    const [paymentsCount, setPaymentsCount] = useState<number>(1);
    const [total, setTotal] = useState<number>(0.00);
    // @TODO: user locale configuration
    const [firstPaymentDate, setFirstPaymentDate] = useState<string>((new Date()).toLocaleDateString('en-NZ'));

    useEffect(() => {
        setTotal(() => {
            let _total = amount * paymentsCount;
            return _total;
        });
    }, [amount, paymentsCount, frequency])

    const processSubmit = () => {
        Alert.alert('I process the form');
    }

    return (
        <LayoutDefault title="Spending">
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={spentStyles.container}>

                <TextInput label="Spent on what?" value={description} onChangeText={setDescription}></TextInput>

                <Decimal label="Amount" value={amount} onChangeText={setAmount} />

                <Switch
                    style={spentStyles.recurringSwitch}
                    label="Recurring Expenditure?"
                    onValueChange={setIsRecurring}
                    onTrueContent={<View>
                        <TextInput label="First Payment Date" value={firstPaymentDate} onChangeText={(_value: string) => setFirstPaymentDate(_value)} />

                        <Dropdown label="" value={frequency}
                            options={paymentFrequencies.getDropdownOptions()}
                            onChangeSelect={(_value: DropdownOptionInterface) => setFrequency(_value)} />

                        <Switch
                            label="Until further notice?"
                            value={isUnlimitedPaymentsCount}
                            onValueChange={setIsUnlimitedPaymentsCount}

                        />

                        {isUnlimitedPaymentsCount && <>
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
