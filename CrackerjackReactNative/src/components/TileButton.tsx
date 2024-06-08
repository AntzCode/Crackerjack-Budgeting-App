import React from 'react';
import { StyleSheet, View, Text, Image, useColorScheme, DimensionValue } from 'react-native';

interface propsInterface {
    width?: DimensionValue;
    imageSource: any;
    children: any;
}

const defaultProps = {
    width: "100%" as DimensionValue,
    imageSource: null,
    children: ''
}

const TileButton = (props: propsInterface) => {
    const isDarkMode = useColorScheme() === 'dark';

    const style = StyleSheet.create({
        container: {
            width: props.width ?? defaultProps.width,
            height: "100%",
            display: "flex",
            flexDirection: "column",
        },
        label: {
            backgroundColor: "#56fc6b",
            color: isDarkMode ? "white" : "black",
            fontSize: 30,
            textAlign: "center",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "black",
            borderTopWidth: 0,
        },
        imageContainer: {
            flex: 1,
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "black",
            borderBottomWidth: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: "#009813",
            width: "100%",
            padding: 10,
            display: "flex",
            flexDirection: "column",
            alignContent: "space-around",
            justifyContent: "space-around"
        },
        image: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: "100%",
            height: "100%",
        }
    });

    return (
        <View style={style.container}>
            <View style={style.imageContainer}>
                {props.imageSource && <Image style={style.image} source={props.imageSource} />}
            </View>
            <Text style={style.label}>{props.children ?? defaultProps.children}</Text>
        </View>

    )
}

export default TileButton;
