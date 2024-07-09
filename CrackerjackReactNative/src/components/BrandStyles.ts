import { StyleSheet } from "react-native";

export const brandStyles = StyleSheet.create({
    defaultBorder: {
        borderColor: '#636363',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5
    },
    strongBorder: {
        borderColor: '#a1a1a1',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    lightBorder: {
        borderColor: '#e7e7e7',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    deep: {
        backgroundColor: '#000f98',
        color: 'white',
    },
    bright: {
        backgroundColor: '#3e9eff',
        color: 'black',
    },
    light: {
        backgroundColor: '#cdfffc'
    },
    subtle: {
        backgroundColor: '#bae0c3',
        color: '#555555',
    },
    primaryButton: {
        backgroundColor: '#00a6dd',
        color: '#ffffff',
    },
    secondaryButton: {
        backgroundColor: '#cccccc',
        color: '#555555'
    },
    dangerButton: {
        backgroundColor: '#fb1a09',
        color: 'white'
    }
});