
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { compose, withObservables } from '@nozbe/watermelondb/react';
import { Card, Divider, FAB, Icon, Text, TouchableRipple } from 'react-native-paper';

import TabulatedData, { convertRecordset } from "../components/TabulatedData";

import { CurrencyFormat } from "../components/CurrencyFormat";
import { brandStyles } from "../components/BrandStyles";

import { PaymentType, ScheduledPayment } from "../store/models/ScheduledPayment";
import { Q } from "@nozbe/watermelondb";
import { Payment } from "../store/models/Payment";

interface propsInterface {
    navigation: any,
    incomesObserved: ScheduledPayment[]
}

export const IncomesScreen = ({ navigation, incomesObserved }: propsInterface) => {

    const incomes = incomesObserved;

    const filterIncomesByPaymentFrequency = (dataset: ScheduledPayment[], frequency: string) => {
        return [...dataset ?? []].filter((model: ScheduledPayment) => model.frequency === frequency);
    }

    const RowFooterDetails = (props: any) => {

        const income: ScheduledPayment = props.income;

        const deleteIncome = async (income: ScheduledPayment) => {
            await income.delete();
            await Payment.generateRunningBalance();
        }

        return <TouchableRipple style={{
            flex: 1,
            alignContent: 'center',
            justifyContent: 'center'
        }} onPress={() => deleteIncome(income as ScheduledPayment)}>
            <Icon source="trash-can"
                color={brandStyles.dangerButton.backgroundColor}
                size={30} />
        </TouchableRipple>

    }

    const TabulatedIncomeGroup = ({ frequency, incomes }: any) => {
        const headerData = false; //convertRecordset([{ Description: '', Amount: '' }]).headerData;
        const recordSet = convertRecordset(filterIncomesByPaymentFrequency(incomes, frequency).map((income: ScheduledPayment) => ({
            description: income.description,
            amount: <CurrencyFormat>{income.amount}</CurrencyFormat>,
            onPress: () => { },
            onLongPress: () => { },
            onShowFooter: <RowFooterDetails income={income}></RowFooterDetails>
        })));

        return <TabulatedData headerData={headerData}
            bodyData={recordSet.bodyData}
            actions={recordSet.actions}
            rowFooters={recordSet.rowFooters}
            options={{ accordionRowFooters: true }} />
    }

    return <>

        <ScrollView contentInsetAdjustmentBehavior="scrollableAxes" style={incomesStyles.container}>

            {incomes.length < 1 && <View key={'x'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Upcoming Payments" />
                    <Card.Content><Text>There is no scheduled payments</Text></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'd').length > 0 && <View key={'d'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Daily" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="d" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'w').length > 0 && <View key={'w'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Weekly" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="w" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'f').length > 0 && <View key={'df'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Fortnightly" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="f" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'm').length > 0 && <View key={'m'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Monthly" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="m" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'm2').length > 0 && <View key={'m2'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="2-Monthly" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="m2" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'm3').length > 0 && <View key={'m3'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="3-Monthly" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="m3" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

            {filterIncomesByPaymentFrequency(incomes, 'y').length > 0 && <View key={'y'}>
                <Card mode={`elevated`} style={incomesStyles.card}>
                    <Card.Title titleVariant="titleLarge" title="Yearly" />
                    <Card.Content><TabulatedIncomeGroup incomes={incomes} frequency="y" /></Card.Content>
                </Card>
                <Divider style={incomesStyles.divider} />
            </View>}

        </ScrollView>

        <FAB variant="primary" color={brandStyles.primaryButton.color} icon={"plus"} style={incomesStyles.fab} onPress={() => navigation.push('Earnt')} />

    </>

}

export const incomesStyles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 15,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: brandStyles.primaryButton.backgroundColor
    },
    container: {
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

export default compose(
    withObservables(['database'], ({ database }) => ({
        incomesObserved: database.get(ScheduledPayment.table).query(Q.where('payment_type', Q.eq(PaymentType.income))),
    })),
)(IncomesScreen)

