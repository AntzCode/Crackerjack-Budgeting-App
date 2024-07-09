import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { get, set } from 'lodash';
import { format as dateFormat } from 'date-fns';

import TabulatedData, { convertRecordset } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Forecast } from "../store/models/Forecast";
import ScheduledPaymentsScreen from "./ScheduledPaymentsScreen";

import { db } from "../store/database";

interface propsInterface {
    navigation: any
}

const ForecastScreen = ({ navigation }: propsInterface) => {

    const Stack = createNativeStackNavigator();
    const [ledger, setLedger] = useState<Forecast[]>([]);

    const [tabRoutes] = useState([
        { key: 'payments', title: 'Payments' },
        { key: 'plans', title: 'Plans' },
    ]);

    useEffect(() => {
        setTimeout(async () => {

            (await db).transaction((txn: any) => {
                txn.executeSql("SELECT * FROM `forecast` ORDER BY `date` ASC", [],
                    (status: any, data: any) => {
                        let items: Forecast[] = [];
                        for (let i = 0; i < data.rows.length; i++) {
                            let row = data.rows.item(i);
                            let forecast = new Forecast();
                            Object.keys(row).forEach((keyname: string) => {
                                set(forecast, keyname, get(row, keyname));
                            });
                            items[i] = forecast;
                        }
                        setLedger(items);
                    }, (error: any) => { console.log('error: ', error) })
            });
        });
    }, []);

    const ledgerData = () => {
        let ledgerData = ledger.map((forecast: Forecast) => {
            return {
                Date: dateFormat(forecast.date, 'yyyy-mm-dd'),
                Description: forecast.description,
                Amount: <CurrencyFormat>{forecast.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{forecast.balance}</CurrencyFormat>
            }
        });
        return convertRecordset(ledgerData);
    }

    const PaymentsView = () => (
        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={ForecastStyles.container}>
            <ScheduledPaymentsScreen navigation={navigation} />
        </ScrollView>
    );

    const PlansView = () => (
        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={ForecastStyles.container}>
            <TabulatedData bodyData={ledgerData().bodyData} headerData={ledgerData().headerData} />
        </ScrollView>
    );

    return <View style={{ display: 'flex', flex: 1, backgroundColor: 'green', height: '100%' }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Plans" component={PlansView} />
        </Stack.Navigator>
    </View>;

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

