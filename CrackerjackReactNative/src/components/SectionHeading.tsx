import React from 'react';
import { StyleSheet, Text, useColorScheme } from 'react-native';

interface pageSubitleProps {
    children: string;
}

const SectionHeading = (props: pageSubitleProps) => {

    const isDarkMode = useColorScheme() === 'dark';

    return (
        <Text style={{
            ...sectionHeadingStyles.text,
            color: isDarkMode ? "white" : "black"
        }}>{props.children}</Text>
    )
}

const sectionHeadingStyles = StyleSheet.create({
    text: {
        fontSize: 30,
        textAlign: "left"
    },
});

export default SectionHeading;
