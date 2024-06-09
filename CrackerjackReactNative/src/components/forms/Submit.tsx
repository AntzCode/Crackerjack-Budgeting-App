import React from 'react';
import { StyleSheet, View } from 'react-native';

import { brandStyles } from '../BrandStyles';
import Button from './Button';
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
                <Button style={{ ...submitStyles.button, backgroundColor: brandStyles.dangerButton.backgroundColor, color: brandStyles.dangerButton.color }} onPress={() => (props.onCancel && props.onCancel())} text={props.cancelText ?? 'Cancel'} />
            </View>
            <View style={submitStyles.buttonColumn}></View>
            <View style={submitStyles.buttonColumn}>
                <Button style={{ ...submitStyles.button, backgroundColor: brandStyles.primaryButton.backgroundColor, color: brandStyles.primaryButton.color }} onPress={() => (props.onSubmit && props.onSubmit())} text={props.submitText ?? 'Submit'} />
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
    button: {
        backgroundColor: brandStyles.bright.backgroundColor,
        textAlign: 'center'
    }
});

export default Submit;

