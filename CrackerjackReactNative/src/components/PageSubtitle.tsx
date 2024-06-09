import React from 'react';
import { StyleSheet, Text, useColorScheme } from 'react-native';

interface pageSubitleProps {
    children: string;
}

const PageSubtitle = (props: pageSubitleProps) => {

    const isDarkMode = useColorScheme() === 'dark';

    return (
        <Text style={{
            ...pageSubtitleStyles.pageTitle,
            color: isDarkMode ? "white" : "black"
        }}>{props.children}</Text>
    )
}

const pageSubtitleStyles = StyleSheet.create({
    pageTitle: {
        fontSize: 30,
        textAlign: "left"
    },
});

export default PageSubtitle;
