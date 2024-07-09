import React, { useState } from 'react';
import { TextInput as ReactTextInput } from 'react-native-paper';
import { formStyles } from './Styles';

interface propsInterface {
    label: string;
    value: string;
    readOnly?: boolean;
    onChangeText: CallableFunction;
    style?: any;
}

const TextInput = (props: propsInterface) => {

    const [value, setValue] = useState<string>(props.value);

    // attribute is truthy if set without a value
    props.readOnly = props.readOnly === undefined || !!props.readOnly;

    return (

        <ReactTextInput
            mode="outlined"
            label={props.label}
            style={{ ...formStyles.input, ...(props.style ?? {}) }}
            inputMode="text" value={`${value}`}
            onChangeText={(_value) => (setValue(_value), props.onChangeText(_value))}
            readOnly={props.readOnly}
        />
    )
}

export default TextInput;
