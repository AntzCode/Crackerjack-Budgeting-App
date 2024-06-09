import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface propsInterface {
    onPress?: CallableFunction;
    text: string;
    style?: any;
}

const Button = (props: propsInterface) => <TouchableOpacity
    onPress={() => (props.onPress && props.onPress())}>
    <Text style={{...buttonStyles.button, ...(props.style ?? {})}}>{props.text}</Text>
</TouchableOpacity>

const buttonStyles = StyleSheet.create({
    button: {
        backgroundColor: 'lightblue',
        padding: 15,
        fontSize: 24,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
    }
});

export default Button;
