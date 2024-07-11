import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Text, TouchableRipple } from "react-native-paper";
import { compose, withObservables } from '@nozbe/watermelondb/react';
import { Q } from "@nozbe/watermelondb";

import { last } from "lodash";
import { addDays, addWeeks, eachWeekOfInterval, formatDate, getDay } from 'date-fns';

import TabulatedData, { convertRecordset, RecordsetType } from "../components/TabulatedData";
import { CurrencyFormat } from "../components/CurrencyFormat";

import { Payment, PaymentType } from "../store/models/Payment";
import { brandStyles } from "../components/BrandStyles";

interface propsInterface {
    navigation: any,
    paymentsObserved: Payment[],
    startDate: Date,
    endDate: Date,
}

const ForecastScreenContent = ({ navigation, paymentsObserved, startDate, endDate }: propsInterface) => {

    const ledger = paymentsObserved;
    const [ledgerData, setLedgerData] = useState<any>(convertRecordset([]));

    const [openWeeks, setOpenWeeks] = useState<number[]>([]);

    useEffect(() => {
        setLedgerData(convertRecordset([...ledger.map((payment: Payment) => {
            return {
                Description: payment.description,
                Amount: <CurrencyFormat>{payment.amount}</CurrencyFormat>,
                Balance: <CurrencyFormat>{payment.balance}</CurrencyFormat>
            }
        })]));
        setOpenWeeks([]);
    }, [ledger]);

    const getWeekPayments = (week: Date) => {
        return ledger.filter((payment: Payment) =>
            payment.date.getTime() >= week.getTime() && payment.date.getTime() < addWeeks(week, 1).getTime()
        )
    }

    const getDayPayments = (day: Date) => {

        let dayStart = (new Date(day));
        dayStart.setHours(0);
        dayStart.setMinutes(0);
        dayStart.setSeconds(0);
        dayStart.setMilliseconds(0);

        let dayEnd = (new Date(day));
        dayEnd.setHours(23);
        dayEnd.setMinutes(59);
        dayEnd.setSeconds(59);
        dayEnd.setMilliseconds(999);

        return ledger.filter((payment: Payment) =>
            payment.date.getTime() >= dayStart.getTime() && payment.date.getTime() < dayEnd.getTime()
        )
    }

    const getDayEndBalance = (day: Date) => {
        return last(getDayPayments(day))?.balance;
    }

    const getWeekStartBalance = (week: Date) => {
        let payment = getWeekPayments(week)[0];
        if (!payment) {
            return 0;
        }
        if (payment.paymentType === PaymentType.income) {
            return payment.balance - payment.amount;
        } else {
            return payment.balance + payment.amount;
        }
    }

    const getWeekEndBalance = (week: Date) => {
        return last(getWeekPayments(week))?.balance ?? 0;
    }

    const toggleOpenWeek = (week: number) => {
        setOpenWeeks((_openWeeks) => {
            if (_openWeeks.includes(week)) {
                return [..._openWeeks.filter((openWeek: number) => openWeek !== week)];
            } else {
                return [..._openWeeks, week];
            }
        })
    }

    return <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={forecastStyles.container}>
        {eachWeekOfInterval({ start: startDate, end: endDate }).map((week: Date, i: number) => <Card key={i} style={forecastStyles.weekContainer}>
            <Card.Title left={(props: any) => <TouchableRipple onPress={() => toggleOpenWeek(i)}><Avatar.Icon {...props} icon="calendar" /></TouchableRipple>}
                title={<TouchableRipple onPress={() => toggleOpenWeek(i)}>
                    <View style={forecastStyles.weekTitleTextContainer}>
                        <Text style={forecastStyles.weekTitleText}>Week {i + 1}</Text>
                        <CurrencyFormat style={forecastStyles.weekTitleCurrency}>{getWeekEndBalance(week) - getWeekStartBalance(week)}</CurrencyFormat>
                        <Text style={forecastStyles.weekTitleText}>{(getWeekEndBalance(week) - getWeekStartBalance(week) < 0 ? '(loss)' : '')}</Text>
                    </View>
                </TouchableRipple>} />
            <Card.Content style={{ ...(!openWeeks.includes(i) ? { display: 'none' } : {}) }}>
                {getWeekPayments(week)
                    .map((payment): number => getDay(payment.date))
                    .reduce((unique: number[], item) => unique.includes(item) ? unique : [...unique, item], [])
                    .map((dayOfWeek: number) => <View key={dayOfWeek}>
                        <View style={forecastStyles.dayOfWeekTitleContainer}>
                            <Text style={forecastStyles.dayOfWeekTitleText}>{formatDate(addDays(week, dayOfWeek), 'EEEE do')}</Text>
                            <CurrencyFormat style={forecastStyles.dayOfWeekTitleBalance}>{getDayEndBalance(addDays(week, dayOfWeek))}</CurrencyFormat>
                        </View>
                        <TabulatedData containerStyle={forecastStyles.dayOfWeekPaymentsContainer}
                            bodyData={convertRecordset(getDayPayments(addDays(week, dayOfWeek))
                                .map((payment: Payment) => {
                                    return {
                                        Description: payment.description,
                                        Amount: <>{payment.paymentType === PaymentType.income ? '+' : '-'}<CurrencyFormat>{payment.amount}</CurrencyFormat></>
                                    }
                                })
                                .concat({
                                    Description: '',
                                    Amount: <CurrencyFormat style={{ ...(getDayEndBalance(addDays(week, dayOfWeek)) < 0 ? { color: brandStyles.dangerButton.backgroundColor } : {}) }}>{getDayEndBalance(addDays(week, dayOfWeek))}</CurrencyFormat>
                                })
                            ).bodyData} headerData={false} emptyMessage="No Payments this Week" />

                    </View>)}

                <View style={forecastStyles.weekClosingBalanceContainer}>
                    <Text style={forecastStyles.weekClosingBalanceTitle}>Closing Balance</Text>
                    <CurrencyFormat style={{
                        ...forecastStyles.weekClosingBalanceAmount,
                        ...(getWeekEndBalance(week) < 0 ? forecastStyles.weekClosingBalanceAmountNegative : {})
                    }}>{getWeekEndBalance(week)}</CurrencyFormat>
                </View>

            </Card.Content>
        </Card>)}

    </ScrollView>

}

export const forecastStyles = StyleSheet.create({
    container: {

    },
    weekContainer: {
        marginVertical: 5,
    },
    weekTitleTextContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    weekTitleText: {
        display: 'flex',
        fontSize: 20,
        color: brandStyles.bright.color,
    },
    weekTitleCurrency: {
        display: 'flex',
        fontSize: 20,
        marginLeft: 50,
        color: brandStyles.bright.color,
    },
    dayOfWeekTitleContainer: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        backgroundColor: brandStyles.secondaryButton.backgroundColor,
        color: brandStyles.secondaryButton.color,
        padding: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    dayOfWeekTitleText: {
        fontSize: 20,
    },
    dayOfWeekTitleBalance: {
        fontSize: 20,
        marginRight: 20,
        display: 'none'
    },
    dayOfWeekPaymentsContainer: {
        borderColor: brandStyles.secondaryButton.backgroundColor,
        borderWidth: brandStyles.defaultBorder.borderWidth,
        borderStyle: brandStyles.defaultBorder.borderStyle,

    },
    weekClosingBalanceContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        marginVertical: 5,
        marginRight: 25
    },
    weekClosingBalanceTitle: {
        fontSize: 18,
        marginRight: 20
    },
    weekClosingBalanceAmount: {
        fontSize: 18,
        color: 'black'
    },
    weekClosingBalanceAmountNegative: {
        color: brandStyles.dangerButton.backgroundColor
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

export default compose(
    withObservables(['database', 'startDate', 'endDate'], ({ database, startDate, endDate }) => ({
        paymentsObserved: database.get(Payment.table).query(
            Q.where('date', Q.between(startDate.getTime(), addDays(endDate, 1).getTime() - 1)),
            Q.sortBy('date', Q.asc)
        ).observe()
    })),
)(ForecastScreenContent)

