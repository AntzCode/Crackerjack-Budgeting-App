import React, { useEffect, useState } from "react";
import { get, set, has } from 'lodash';
import dateFormat from 'dateformat';
import { db } from "../store/database";
import { ScrollView, StyleSheet, View } from "react-native";
import LayoutDefault from "./LayoutDefault";
import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { Transaction } from "../store/models/Transaction";
import { CurrencyFormat } from "../components/CurrencyFormat";

interface propsInterface {
    navigation: any
}

const LedgerScreen = ({ navigation }: propsInterface) => {

    const [redrawPage, setRedrawPage] = useState<number>(0);
    const [ledger, setLedger] = useState<Transaction[]>([]);

    useEffect(() => {
        db.transaction((txn: any) => {
            txn.executeSql("SELECT * FROM `transaction` ORDER BY `date` DESC", [],
                (status: any, data: any) => {
                    let items: Transaction[] = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows.item(i);
                        let transaction = new Transaction();
                        Object.keys(row).forEach((keyname: string) => {
                            set(transaction, keyname, get(row, keyname));
                        });
                        items.push(transaction);
                    }
                    setLedger(items);
                }, (error: any) => { console.log('error: ', error) })
        });
    }, [, redrawPage]);

    const ledgerData = () => {
        let ledgerData = ledger.map((transaction: Transaction) => {
            return {
                Date: dateFormat(transaction.date, 'yyyy-mm-dd HH:MMtt'),
                Description: transaction.description,
                Amount: <CurrencyFormat>{transaction.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{transaction.balance}</CurrencyFormat>
            }
        });
        return convertRecordset([...ledgerData]);
    }


    return (<LayoutDefault title="Txn History" navigation={navigation}>
        <View style={LedgerStyles.container}>
            <ScrollView contentInsetAdjustmentBehavior="scrollableAxes">
            <TabulatedData bodyData={ledgerData().bodyData} headerData={ledgerData().headerData} />
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

export default LedgerScreen;
