import { Text } from "react-native";

export interface propsInterface {
    children: number,
    style?: any
}

export const defaultProps = {
}

export const currencyFormat = (value: number, locale: string = 'en-NZ', currency: string = 'NZD'): string => {
    return (parseFloat('' + value)).toLocaleString(locale, {
        style: 'currency',
        currency,
    })
}

export const CurrencyFormat = function (props: propsInterface) {
    props = { ...defaultProps, ...props };
    return <Text style={{ ...props.style ?? {} }}>{currencyFormat(props.children)}</Text>
}