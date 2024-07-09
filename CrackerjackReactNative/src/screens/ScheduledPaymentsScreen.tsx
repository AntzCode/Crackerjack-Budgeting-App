import React from "react";
import { StyleSheet, View } from "react-native";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import {
    TabsProvider,
    Tabs,
    TabScreen,
} from 'react-native-paper-tabs';

import IncomesScreen from "./IncomesScreen";
import ExpensesScreen from "./ExpensesScreen";

interface propsInterface {
    navigation: any
}

const ScheduledPaymentsScreen = ({ navigation }: propsInterface) => {

    const Stack = createNativeStackNavigator();

    const Tab = createMaterialBottomTabNavigator();

    return (<TabsProvider>
        <Tabs>
            <TabScreen label="Income" icon="cash-multiple">
                <View style={{ flex: 1 }}>
                    <IncomesScreen navigation={navigation} />
                </View>
            </TabScreen>
            <TabScreen label="Expenses" icon="cart">
                <View style={{ flex: 1 }}>
                    <ExpensesScreen navigation={navigation} />
                </View>
            </TabScreen>
        </Tabs>
    </TabsProvider>)

}

export const scheduledPaymentsStyles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 15,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    container: {
        flex: 1,
    },
    card: {
        margin: 15,
    },
    divider: {
        marginVertical: 0
    },
    item: {
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 10
    },
    itemText: {
        fontSize: 20
    }
});

export default ScheduledPaymentsScreen;
