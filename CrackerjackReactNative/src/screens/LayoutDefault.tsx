import React, { ReactNode } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, useColorScheme } from 'react-native';

interface layoutProps {
    children: Element | Element[],
    title?: string;
    style?: any;
    navigation: any
}

const LayoutDefault = (props: layoutProps) => {

    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaView style={{ ...layoutStyles.pageContainer, ...(props.style ?? {}) }}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <View style={layoutStyles.contentContainer}>
                {props.children as ReactNode[]}
            </View>
        </SafeAreaView>
    )
}

const layoutStyles = StyleSheet.create({
    screenContainer: {
    },
    pageContainer: {
        display: "flex",
        height: "100%",
    },
    contentContainer: {
        marginHorizontal: 20,
        flex: 1
    }
});

export default LayoutDefault;

