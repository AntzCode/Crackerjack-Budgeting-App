import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { formStyles } from './Styles';

interface propsInterface {
    label: string;
    value: number;
    readOnly?: boolean;
    onChangeText: CallableFunction;
    style?: any;
}

const Decimal = (props: propsInterface) => {

    const [value, setValue] = useState<string>(`${props.value}`);

    useEffect(() => {
        setValue(`${props.value}`);
    }, [props.value]);

    // attribute is truthy if set without a value
    props.readOnly = props.readOnly === undefined || !!props.readOnly;

    const onChangeText = (_value: string) => {
        let numericValue = 0;
        if (_value.length > 0) {
            try {
                numericValue = parseFloat(_value);
                if (Number.isNaN(numericValue)) {
                    setValue('');
                    props.onChangeText(0);
                } else {
                    setValue(_value);
                    props.onChangeText(numericValue);
                }
            } catch (e: any) {
                setValue('');
                props.onChangeText(0);
            }
        } else {
            setValue('');
            props.onChangeText(0);
        }
    }

    return (
        <TextInput
            label={props.label}
            mode="outlined"
            style={{ ...formStyles.input, ...(props.style ?? {}) }}
            inputMode="decimal" value={`${value}`}
            onChangeText={onChangeText}
            readOnly={props.readOnly}
        />
    )
}

export default Decimal;
