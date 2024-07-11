import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { addMonths, formatDate, getDaysInMonth, subMonths } from "date-fns";
import ForecastScreenContent from "./ForecastScreenContent";
import { Text } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface propsInterface {
    navigation: any,
    database: any
}

interface ForecastScreenCurrentMonthInterface {
    month: number;
    year: number;
    label: string,
    date: Date
}

const ForecastScreen = ({ navigation, database }: propsInterface) => {

    const [currentMonth, setCurrentMonth] = useState<ForecastScreenCurrentMonthInterface>({
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth(),
        label: formatDate(new Date(), 'MMMM yyyy'),
        date: new Date()
    });

    const goToPreviousMonth = () => {
        setCurrentMonth((_currentMonth) => {
            let newCurrentDate = subMonths(_currentMonth.date, 1);
            return {
                year: newCurrentDate.getFullYear(),
                month: newCurrentDate.getMonth(),
                label: formatDate(newCurrentDate, 'MMMM yyyy'),
                date: newCurrentDate
            } as ForecastScreenCurrentMonthInterface;
        })
    }

    const goToNextMonth = () => {
        setCurrentMonth((_currentMonth) => {
            let newCurrentDate = addMonths(_currentMonth.date, 1);
            return {
                year: newCurrentDate.getFullYear(),
                month: newCurrentDate.getMonth(),
                label: formatDate(newCurrentDate, 'MMMM yyyy'),
                date: newCurrentDate
            } as ForecastScreenCurrentMonthInterface;
        });
    }

    return <View style={forecastScreenStyles.container}>
        <View style={forecastScreenStyles.dateSelectorContainer}>
            <MaterialCommunityIcons onPress={() => goToPreviousMonth()} name="chevron-left" size={50}></MaterialCommunityIcons>
            <Text style={{ fontSize: 30 }}>{currentMonth.label}</Text>
            <MaterialCommunityIcons onPress={() => goToNextMonth()} name="chevron-right" size={50}></MaterialCommunityIcons>
        </View>
        <View style={forecastScreenStyles.contentContainer}>
            <ForecastScreenContent database={database}
                startDate={new Date(currentMonth.year, currentMonth.month, 1)}
                endDate={new Date(currentMonth.year, currentMonth.month, getDaysInMonth(currentMonth.date))}
            />
        </View>
    </View>

}

export const forecastScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    dateSelectorContainer: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    contentContainer: {
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

export default ForecastScreen;
