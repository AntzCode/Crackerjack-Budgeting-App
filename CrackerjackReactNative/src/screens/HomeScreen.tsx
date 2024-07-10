import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, TouchableRipple } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LayoutDefault from './LayoutDefault';
import TileButton from '../components/TileButton';
import ForecastScreen from './ForecastScreen';
import ScheduledPaymentsScreen from './ScheduledPaymentsScreen';
import { db } from '../store/database';
import TabulatedData, { convertRecordset } from '../components/TabulatedData';
import { withDatabase } from '@nozbe/watermelondb/react';

interface propsInterface {
    navigation: any
}

export const HomeScreenContent = ({ navigation }: propsInterface) => {

    const [devModeCounter, setDevModeCounter] = useState<number>(0);

    const [migrations, setMigrations] = useState<any[]>([]);

    const refreshMigrationsList = async () => {
        if (devModeCounter > 10) {
            (await db).transaction((txn: any) => {
                txn.executeSql("SELECT * FROM `migration`", [], (sqlTxn: any, res: any) => {
                    if (res.rows.length > 0) {
                        let items: any[] = [];
                        for (let i = 0; i < res.rows.length; i++) {
                            items.push(res.rows.item(i));
                        }
                        setMigrations(items);
                    } else {
                        setMigrations([]);
                    }
                }, (error: any) => { console.log(error) });
            });
        }
    }

    const dropMigrations = async () => {
        (await db).transaction(async (txn: any) => {
            await txn.executeSql("DELETE FROM `migration`");
            refreshMigrationsList();
        });
    }

    useEffect(() => {
        if (devModeCounter > 10) {
            refreshMigrationsList();
        }
    }, [devModeCounter]);

    return <LayoutDefault navigation={navigation}>
        {devModeCounter > 10 && <View style={homeStyles.devMode}>
            <Text variant="headlineLarge">Dev Mode</Text>
            <Button mode="contained" onPress={() => dropMigrations()}>Drop Migrations</Button>
            <Text variant="headlineLarge">Migrations</Text>
            {migrations.length < 1 && <Text>There is no migrations in the db</Text>}
            <TabulatedData bodyData={convertRecordset(migrations.map((migration: any) => { return { filename: migration.filename } })).bodyData} />
            <Button mode="contained" onPress={() => setDevModeCounter(0)}>Go Back</Button>
        </View>}
        <View style={homeStyles.headerContainer}>
            <TouchableRipple onPress={() => setDevModeCounter(devModeCounter + 1)}>
                <Image style={homeStyles.headerLogo} source={require(`../assets/images/Logo/Crackerjack-Budgie-Large.png`)} />
            </TouchableRipple>
            <Text style={homeStyles.headerLogoName}>Crackerjack</Text>
        </View>
        <View style={homeStyles.fullPageContainer}>
            <View style={homeStyles.heroImageContainer}>
                <Image source={require("../assets/images/HomePage/BarChart-Example.png")} style={homeStyles.heroImage} />
            </View>
            <View style={homeStyles.footerContainer}>
                <TouchableRipple onPress={() => navigation.push("Ledger")} style={homeStyles.footerContainerButton}>
                    <TileButton imageSource={require(`../assets/images/HomePage/History-Large.png`)}>Ledger</TileButton>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.push('Forecast')} style={homeStyles.footerContainerButton}>
                    <TileButton imageSource={require(`../assets/images/HomePage/Plan-Large.png`)}>Plans</TileButton>
                </TouchableRipple>
            </View>
            <View style={homeStyles.footerContainer}>
                <TouchableRipple onPress={() => navigation.push("Spent")} style={homeStyles.footerContainerButton}>
                    <TileButton imageSource={require(`../assets/images/HomePage/Spent-Large.png`)}>I Spent</TileButton>
                </TouchableRipple>
                <TouchableRipple onPress={() => navigation.push('Earnt')} style={homeStyles.footerContainerButton}>
                    <TileButton imageSource={require(`../assets/images/HomePage/Earnt-Large.png`)}>I Earnt</TileButton>
                </TouchableRipple>
            </View>
        </View>
    </LayoutDefault>
}

export const HomeScreen = ({ navigation }: propsInterface): React.JSX.Element => {

    const Tab = createMaterialBottomTabNavigator();

    return <View style={{ display: 'flex', flex: 1, backgroundColor: 'orange', height: '100%' }}>
        <Tab.Navigator
            initialRouteName='Home'
            barStyle={{
                borderTopWidth: 1,
                borderTopColor: 'gray'
            }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreenContent}
                options={{
                    tabBarLabel: 'Home',

                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="bird" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen name="Forecast" component={withDatabase(ForecastScreen)}
                options={{
                    tabBarLabel: 'Forecast',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="telescope" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Payments" component={ScheduledPaymentsScreen}
                options={{
                    tabBarLabel: 'Payments',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="cash-multiple" color={color} size={26} />
                    ),
                }} />
        </Tab.Navigator></View>

}

const homeStyles = StyleSheet.create({
    fullPageContainer: {
        display: "flex",
        flex: 0,
        height: '85%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    devMode: {
        position: 'absolute',
        zIndex: 5,
        left: 0,
        top: 0,
        paddingTop: '20%',
        width: '100%',
        height: '100%',
        backgroundColor: "white"
    },
    headerContainer: {
        width: "100%",
        height: "15%",
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    headerLogo: {
        width: 80,
        height: 120,
    },
    headerLogoName: {
        fontSize: 50,
        textAlignVertical: "top",
        color: "#421d1d"
    },
    heroImageContainer: {
        display: "flex",
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignContent: "center",
    },
    heroImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        textAlignVertical: 'top'
    },
    footerContainer: {
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignContent: "space-around",
        justifyContent: "space-evenly",
        marginTop: 10,
        marginBottom: 10
    },
    footerContainerButton: {
        width: "45%"
    }
});

export default HomeScreen;

