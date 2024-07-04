import React, { ReactNode, useEffect, useState } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View, useColorScheme } from 'react-native';
import { db } from '../store/database';
import Button from '../components/forms/Button';
import SectionHeading from '../components/SectionHeading';

interface layoutProps {
    children: Element | Element[],
    title?: string;
    style?: any;
    navigation: any
}

const LayoutDefault = (props: layoutProps) => {

    const isDarkMode = useColorScheme() === 'dark';
    layoutStyles.screenContainer.backgroundColor = isDarkMode ? 'gray' : 'lightgray';
    layoutStyles.pageContainer.backgroundColor = isDarkMode ? "gray" : "lightgray";

    const [devModeCounter, setDevModeCounter] = useState<number>(0);

    const [migrations, setMigrations] = useState<any[]>([]);

    const dropMigrations = async () => {
        await db.transaction(async (txn: any) => {
            await txn.executeSql("DELETE FROM `migration`");
            refreshMigrationsList();
        });

    }

    const refreshMigrationsList = () => {
        if (devModeCounter > 10) {
            db.transaction((txn: any) => {
                txn.executeSql("SELECT * FROM `migration`", [], (sqlTxn: any, res: any) => {
                    if (res.rows.length > 0) {
                        let items = [];
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

    useEffect(() => {
        if (devModeCounter > 10) {
            refreshMigrationsList();
        }
    }, [devModeCounter]);

    return (
        <SafeAreaView style={{ ...layoutStyles.pageContainer, ...(props.style ?? {}) }}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={layoutStyles.screenContainer.backgroundColor}
            />
            {devModeCounter > 10 && <View style={layoutStyles.devMode}>
                <Text style={layoutStyles.devModeHeading}>Dev Mode</Text>
                <Button onPress={() => dropMigrations()} text="Drop Migrations"></Button>
                <SectionHeading>Migrations</SectionHeading>
                {migrations.length < 1 && <Text>There is no migrations in the db</Text>}
                {migrations.map((migration: any) => <Text>{migration.filename}</Text>)}
                <Button onPress={() => setDevModeCounter(0)} text="Go Back"></Button>
            </View>}
            <View style={layoutStyles.headerContainer}>
                <TouchableHighlight onPress={() => setDevModeCounter(devModeCounter + 1)}>
                    <Image style={layoutStyles.headerLogo} source={require(`../assets/images/Logo/Crackerjack-Budgie-Large.png`)} />
                </TouchableHighlight>
                <Text style={layoutStyles.headerLogoName}>{props.title ?? 'Crackerjack'}</Text>
            </View>
            <View style={layoutStyles.contentContainer}>
                {props.children as ReactNode[]}
            </View>
        </SafeAreaView>
    )
}

const layoutStyles = StyleSheet.create({
    screenContainer: {
        backgroundColor: 'lightgray'
    },
    pageContainer: {
        display: "flex",
        backgroundColor: 'lightgray',
        height: "100%",
    },
    headerContainer: {
        width: "100%",
        height: 120,
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
        color: "#e81800"
    },
    contentContainer: {
        marginHorizontal: 20,
        flex: 1
    },
    devMode: {
        position: 'absolute',
        zIndex: 5,
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: "white"
    },
    devModeHeading: {
        fontSize: 30
    }
});

export default LayoutDefault;

