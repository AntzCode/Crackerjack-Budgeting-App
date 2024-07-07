import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { get, set } from 'lodash';
import dateFormat from 'dateformat';

import LayoutDefault from "./LayoutDefault";
import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Forecast } from "../store/models/Forecast";
import { db } from "../store/database";
import { TabView, SceneMap } from 'react-native-tab-view';
import { brandStyles } from "../components/BrandStyles";
import ScheduledPaymentsScreen from "./ForecastScreen_Payments";

interface propsInterface {
    navigation: any
}

const ForecastScreen = ({ navigation }: propsInterface) => {

    const layout = useWindowDimensions();

    const [tabIndex, setTabIndex] = useState<number>(0);
    const [redrawPage, setRedrawPage] = useState<number>(0);
    const [ledger, setLedger] = useState<Forecast[]>([]);

    const [tabRoutes] = useState([
        { key: 'payments', title: 'Payments' },
        { key: 'plans', title: 'Plans' },
    ]);

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

    const PaymentsRoute = () => (
        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={ForecastStyles.container}>
            <ScheduledPaymentsScreen navigation={navigation} />
        </ScrollView>
    );

    const PlansRoute = () => (
        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={ForecastStyles.container}>
            <TabulatedData bodyData={ledgerData().bodyData} headerData={ledgerData().headerData} />
        </ScrollView>
    );

    const renderScene = SceneMap({
        payments: PaymentsRoute,
        plans: PlansRoute,
    });

    return (<LayoutDefault title="Txn Forecast" navigation={navigation}>
        <TabView
            navigationState={{ index: tabIndex, routes: tabRoutes }}
            renderScene={renderScene}
            onIndexChange={setTabIndex}
            initialLayout={{ width: layout.width }}
        />
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

