import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { compose, withObservables } from '@nozbe/watermelondb/react';
import { Q } from "@nozbe/watermelondb";
import { format as dateFormat } from 'date-fns';

import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Payment } from "../store/models/Payment";

interface propsInterface {
    navigation: any,
    paymentsObserved: Payment[]
}

const ForecastScreen = ({ navigation, paymentsObserved }: propsInterface) => {

    const ledger = paymentsObserved;
    const [ledgerData, setLedgerData] = useState<any>(convertRecordset([]));

    useEffect(() => {
        setLedgerData(convertRecordset([...ledger.map((payment: Payment) => {
            return {
                Date: dateFormat(payment.date, 'yyyy-MM-dd'),
                Description: payment.description,
                Amount: <CurrencyFormat>{payment.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{payment.balance}</CurrencyFormat>
            }
        })]));
    }, [ledger]);

    return <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={forecastStyles.container}>
        <TabulatedData bodyData={ledgerData.bodyData} headerData={ledgerData.headerData} />
    </ScrollView>

}

export const forecastStyles = StyleSheet.create({
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

export default compose(
    withObservables(['database'], ({ database }) => ({
        paymentsObserved: database.get(Payment.table).query(Q.sortBy('date', Q.asc), Q.take(100)).observe()
    })),
)(ForecastScreen)

