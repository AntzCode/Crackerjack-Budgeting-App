/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';

import TileButton from './src/components/TileButton';

function App(): React.JSX.Element {

    const isDarkMode = useColorScheme() === 'dark';

    const styles = StyleSheet.create({
        pageContainer: {
            display: "flex",
            backgroundColor: isDarkMode ? "gray" : "lightgray",
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
        heroImageContainer: {
            display: "flex",
            flexDirection: 'row',
            justifyContent: "center",
            alignContent: "center"
        },
        heroImage: {
            width: 400,
            height: 300
        },
        footerContainer: {
            height: "30%",
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

    const backgroundStyle = {
        backgroundColor: isDarkMode ? "gray" : "lightgray",
    };

    return (
        <SafeAreaView style={styles.pageContainer}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={styles.headerContainer}>
                <Image style={styles.headerLogo} source={require(`./src/assets/images/Logo/Crackerjack-Budgie-Large.png`)} />
                <Text style={styles.headerLogoName}>Crackerjack</Text>
            </View>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={styles.heroImageContainer}>
                    <Image source={require("./src/assets/images/HomePage/BarChart-Example.png")} style={styles.heroImage} />
                </View>
            </ScrollView>
            <View style={styles.footerContainer}>
                <TouchableOpacity onPress={() => Alert.alert('Spent was pressed')} style={styles.footerContainerButton}>
                    <TileButton imageSource={require(`./src/assets/images/HomePage/Spent-Large.png`)}>I Spent</TileButton>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Earnt was pressed')} style={styles.footerContainerButton}>
                    <TileButton imageSource={require(`./src/assets/images/HomePage/Earnt-Large.png`)}>I Earnt</TileButton>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default App;
