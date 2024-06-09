import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface propsInterface {
    label?: string;
    style?: any;
    horizontal?: boolean;
    footerContent?: Element;
    children: Element | Element[];
}

const FormField = (props: propsInterface) => {

    // attribute is truthy if set without a value
    props.horizontal = props.horizontal === undefined || !!props.horizontal;

    return (
        <View style={{ ...(props.style ?? {}), ...formFieldStyles.container, ...(props.horizontal && formFieldStylesHorizontal.container) }}>
            <View style={{ ...formFieldStyles.row, ...(props.style ?? {}), ...(props.horizontal && formFieldStylesHorizontal.row) }}>
                {props.label && <Text style={{ ...formFieldStyles.label, ...(props.style ?? {}), ...(props.horizontal && formFieldStylesHorizontal.label) }}>{props.label}</Text>}
                <View style={{ ...formFieldStyles.content, ...(props.horizontal && formFieldStylesHorizontal.content) }}>
                    {props.children as ReactNode[]}
                </View>
            </View>
            {props.footerContent && <View style={{ ...formFieldStyles.footer, ...(props.horizontal && formFieldStylesHorizontal.footer) }}>{props.footerContent as ReactNode}</View>}
        </View>
    )
}

export const formFieldStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: 24,
    },
    content: {
        display: 'flex',
        flexDirection: 'row'
    },
    footer: {
        flex: 0,
        width: '100%',
    },
    inputText: {
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 24,
        width: '100%',
        paddingHorizontal: 10,
    },
});

const formFieldStylesHorizontal = StyleSheet.create({
    container: {},
    row: {
        flexDirection: 'row'
    },
    label: {
        flex: 1,
    },
    content: {},
    footer: {}
});

export default FormField;