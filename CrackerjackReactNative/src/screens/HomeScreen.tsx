import React from 'react';

import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

import TileButton from '../components/TileButton';
import LayoutDefault from './LayoutDefault';
import Button from '../components/forms/Button';

interface propsInterface {
    navigation: any
}

export const HomeScreen = ({ navigation }: propsInterface): React.JSX.Element => {

    const isDarkMode = useColorScheme() === 'dark';

    return (

        <LayoutDefault navigation={navigation}>
            <View style={homeStyles.fullPageContainer}>
                <View style={homeStyles.heroImageContainer}>
                    <Image source={require("../assets/images/HomePage/BarChart-Example.png")} style={homeStyles.heroImage} />
                </View>
                <View style={homeStyles.footerContainer}>
                    <TouchableOpacity onPress={() => navigation.push("Ledger")} style={homeStyles.footerContainerButton}>
                        <TileButton imageSource={require(`../assets/images/HomePage/History-Large.png`)}>Ledger</TileButton>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.push('Forecast')} style={homeStyles.footerContainerButton}>
                        <TileButton imageSource={require(`../assets/images/HomePage/Plan-Large.png`)}>Plans</TileButton>
                    </TouchableOpacity>
                </View>
                <View style={homeStyles.footerContainer}>
                    <TouchableOpacity onPress={() => navigation.push("Spent")} style={homeStyles.footerContainerButton}>
                        <TileButton imageSource={require(`../assets/images/HomePage/Spent-Large.png`)}>I Spent</TileButton>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.push('Earnt')} style={homeStyles.footerContainerButton}>
                        <TileButton imageSource={require(`../assets/images/HomePage/Earnt-Large.png`)}>I Earnt</TileButton>
                    </TouchableOpacity>
                </View>
            </View>
        </LayoutDefault>

    )
}

const homeStyles = StyleSheet.create({
    fullPageContainer: {
        display: "flex",
        flex: 0,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center'
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

