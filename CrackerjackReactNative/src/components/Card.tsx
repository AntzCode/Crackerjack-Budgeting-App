import React, { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface cardProps {
    children?: string | ReactElement;
    title?: string | ReactElement;
    footer?: string | ReactElement;
}

const Card = (props: cardProps) => {

    return (
        <View style={{
            ...cardStyles.container
        }}>
            {typeof props.title !== 'undefined' && <View style={cardStyles.titleContainer}>
                {typeof props.title === 'string'
                    ? <Text style={cardStyles.titleText}>{props.title}</Text>
                    : <>{props.title}</>
                }
            </View>}
            {typeof props.children !== 'undefined' && <View style={cardStyles.contentContainer}>
                {typeof props.children === 'string'
                    ? <Text style={cardStyles.contentText}>{props.children}</Text>
                    : <>{props.children}</>
                }
            </View>}
            {typeof props.footer !== 'undefined' && <View style={cardStyles.footerContainer}>
                {typeof props.footer === 'string'
                    ? <Text style={cardStyles.footerText}>{props.footer}</Text>
                    : <>{props.footer}</>
                }
            </View>}
        </View>
    )
}

export const cardStyles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 15,
        margin: 10,
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
    },
    titleContainer: {
        padding: 15,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-between'
    },
    titleText: {
        fontSize: 30
    },
    contentContainer: {

    },
    contentText: {
        fontSize: 30,
        textAlign: "left"
    },
    footerContainer: {
        width: '100%',
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-between'
    },
    footerText: {

    }
});

export default Card;
