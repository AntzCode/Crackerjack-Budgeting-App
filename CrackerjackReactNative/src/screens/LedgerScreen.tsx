import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { compose, withObservables } from '@nozbe/watermelondb/react';
import { Q } from "@nozbe/watermelondb";
import { format as dateFormat } from 'date-fns';

import LayoutDefault from "./LayoutDefault";

import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Transaction } from "../store/models/Transaction";


interface propsInterface {
    navigation: any
    transactionsObserved: Transaction[]
}

const LedgerScreen = ({ navigation, transactionsObserved }: propsInterface) => {

    const ledger = transactionsObserved;
    const [ledgerData, setLedgerData] = useState<any>(convertRecordset([]));

    useEffect(() => {
        setLedgerData(convertRecordset([...ledger.map((transaction: Transaction) => {
            return {
                Date: dateFormat(transaction.date, 'yyyy-MM-dd'),
                Description: transaction.description,
                Amount: <CurrencyFormat>{transaction.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{transaction.balance}</CurrencyFormat>
            }
        })]));
    }, [ledger]);

    return (<LayoutDefault title="Txn History" navigation={navigation}>
        <View style={LedgerStyles.container}>
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes">
                <TabulatedData bodyData={ledgerData.bodyData} headerData={ledgerData.headerData} />
            </ScrollView>
        </View>

    </LayoutDefault>);

}

export const LedgerStyles = StyleSheet.create({
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
        transactionsObserved: database.get(Transaction.table).query(Q.sortBy('date', Q.asc), Q.take(500)).observe()
    })),
)(LedgerScreen)
