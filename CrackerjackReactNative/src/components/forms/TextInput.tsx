import React, { useState } from 'react';
import { TextInput as ReactTextInput } from 'react-native';

import FormField, { formFieldStyles } from './FormField';

interface propsInterface {
    label: string;
    value: string;
    readOnly?: boolean;
    onChangeText: CallableFunction;
}

const TextInput = (props: propsInterface) => {

    const [value, setValue] = useState<string>(props.value);

    // attribute is truthy if set without a value
    props.readOnly = props.readOnly === undefined || !!props.readOnly;

    return (
        <FormField label={props.label}>
            <ReactTextInput style={formFieldStyles.inputText}
                inputMode="text" value={`${value}`}
                onChangeText={(_value) => (setValue(_value), props.onChangeText(_value))}
                readOnly={props.readOnly}
            />
        </FormField>
    )
}

export default TextInput;
