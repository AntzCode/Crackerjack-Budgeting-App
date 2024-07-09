import React from 'react';
import { StyleSheet, View } from 'react-native';

import { brandStyles } from '../BrandStyles';
import { Button } from 'react-native-paper';
import FormField from './FormField';

interface propsInterface {
    onSubmit: CallableFunction;
    submitText: string;
    onCancel?: CallableFunction;
    cancelText?: string;
}

const Submit = (props: propsInterface) => {

    return (
        <FormField style={submitStyles.container}>
            <View style={submitStyles.buttonColumn}>
                <Button mode="contained"
                    buttonColor={brandStyles.secondaryButton.backgroundColor}
                    textColor={brandStyles.secondaryButton.color}
                    onPress={() => (props.onCancel && props.onCancel())}>{props.cancelText ?? 'Cancel'}</Button>
            </View>
            <View style={submitStyles.buttonColumn}></View>
            <View style={submitStyles.buttonColumn}>
                <Button mode="contained"
                    buttonColor={brandStyles.primaryButton.backgroundColor}
                    textColor={brandStyles.primaryButton.color}
                    onPress={() => (props.onSubmit && props.onSubmit())}>{props.submitText ?? 'Submit'}</Button>
            </View>
        </FormField>
    )
}

const submitStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    buttonColumn: {
        flex: 1,
    },
});

export default Submit;

