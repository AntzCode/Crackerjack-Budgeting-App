import React from 'react';

import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

import TileButton from '../components/TileButton';
import LayoutDefault from './LayoutDefault';

interface propsInterface {
    navigation: any
}

const defaultProps = {
}

export const HomeScreen = ({ navigation }: propsInterface): React.JSX.Element => {

    const isDarkMode = useColorScheme() === 'dark';

    return (

        <LayoutDefault>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
                <View style={homeStyles.heroImageContainer}>
                    <Image source={require("../assets/images/HomePage/BarChart-Example.png")} style={homeStyles.heroImage} />
                </View>
            </ScrollView>
            <View style={homeStyles.footerContainer}>
                <TouchableOpacity onPress={() => navigation.push("Spent")} style={homeStyles.footerContainerButton}>
                    <TileButton imageSource={require(`../assets/images/HomePage/Spent-Large.png`)}>I Spent</TileButton>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.push('Earnt')} style={homeStyles.footerContainerButton}>
                    <TileButton imageSource={require(`../assets/images/HomePage/Earnt-Large.png`)}>I Earnt</TileButton>
                </TouchableOpacity>
            </View>
        </LayoutDefault>

    )
}

const homeStyles = StyleSheet.create({
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

export default HomeScreen;

