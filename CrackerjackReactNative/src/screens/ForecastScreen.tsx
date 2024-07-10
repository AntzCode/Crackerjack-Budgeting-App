import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { compose, withObservables } from '@nozbe/watermelondb/react';
import { Q } from "@nozbe/watermelondb";
import { format as dateFormat } from 'date-fns';

import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Forecast } from "../store/models/Forecast";

interface propsInterface {
    navigation: any,
    forecastsObserved: Forecast[]
}

const ForecastScreen = ({ navigation, forecastsObserved }: propsInterface) => {

    const ledger = forecastsObserved;
    const [ledgerData, setLedgerData] = useState<any>(convertRecordset([]));

    useEffect(() => {
        setLedgerData(convertRecordset([...ledger.map((forecast: Forecast) => {
            return {
                Date: dateFormat(forecast.date, 'yyyy-MM-dd'),
                Description: forecast.description,
                Amount: <CurrencyFormat>{forecast.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{forecast.balance}</CurrencyFormat>
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
        forecastsObserved: database.get(Forecast.table).query(Q.sortBy('date', Q.asc), Q.take(100)).observe()
    })),
)(ForecastScreen)

