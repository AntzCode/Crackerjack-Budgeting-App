import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { get, set } from 'lodash';
import dateFormat from 'dateformat';

import LayoutDefault from "./LayoutDefault";
import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Forecast } from "../store/models/Forecast";
import { db } from "../store/database";


interface propsInterface {
    navigation: any
}

const ForecastScreen = ({ navigation }: propsInterface) => {

    const [redrawPage, setRedrawPage] = useState<number>(0);
    const [ledger, setLedger] = useState<Forecast[]>([]);

    useEffect(() => {
        db.transaction((txn: any) => {
            txn.executeSql("SELECT * FROM `forecast` ORDER BY `date` ASC", [],
                (status: any, data: any) => {
                    let items: Forecast[] = [];
                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows.item(i);
                        let forecast = new Forecast();
                        Object.keys(row).forEach((keyname: string) => {
                            set(forecast, keyname, get(row, keyname));
                        });
                        items.push(forecast);
                    }
                    setLedger(items);
                }, (error: any) => { console.log('error: ', error) })
        });
    }, [, redrawPage]);

    const ledgerData = () => {
        let ledgerData = ledger.map((forecast: Forecast) => {
            return {
                Date: dateFormat(forecast.date, 'yyyy-mm-dd HH:MMtt'),
                Description: forecast.description,
                Amount: <CurrencyFormat>{forecast.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{forecast.balance}</CurrencyFormat>
            }
        });
        return convertRecordset([...ledgerData]);
    }


    return (<LayoutDefault title="Txn Forecast" navigation={navigation}>
        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={ForecastStyles.container}>
            <TabulatedData bodyData={ledgerData().bodyData} headerData={ledgerData().headerData} />
        </ScrollView>
    </LayoutDefault>);

}

export const ForecastStyles = StyleSheet.create({
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

export default ForecastScreen;

