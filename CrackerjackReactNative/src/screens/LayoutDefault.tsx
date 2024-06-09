import React, { ReactNode } from 'react';
import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native';

interface layoutProps {
    children: Element | Element[],
    title?: string;
    style?: any;
}

const LayoutDefault = (props: layoutProps) => {

    const isDarkMode = useColorScheme() === 'dark';
    layoutStyles.screenContainer.backgroundColor = isDarkMode ? 'gray' : 'lightgray';
    layoutStyles.pageContainer.backgroundColor = isDarkMode ? "gray" : "lightgray";

    return (
        <SafeAreaView style={{ ...layoutStyles.pageContainer, ...(props.style ?? {}) }}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={layoutStyles.screenContainer.backgroundColor}
            />
            <View style={layoutStyles.headerContainer}>
                <Image style={layoutStyles.headerLogo} source={require(`../assets/images/Logo/Crackerjack-Budgie-Large.png`)} />
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
    }
});

export default LayoutDefault;

