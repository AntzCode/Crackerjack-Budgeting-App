import React, { useState } from 'react';
import { TextInput } from 'react-native';

import FormField, { formFieldStyles } from './FormField';

interface propsInterface {
    label: string;
    value: number;
    readOnly?: boolean;
    onChangeText: CallableFunction;
}

const Numeric = (props: propsInterface) => {

    const [value, setValue] = useState<string>(`${props.value}`);

    // attribute is truthy if set without a value
    props.readOnly = props.readOnly === undefined || !!props.readOnly;

    return (
        <FormField label={props.label}>
            <TextInput style={formFieldStyles.inputText}
                inputMode="numeric" value={`${value}`}
                onChangeText={(_value) => (setValue(_value), props.onChangeText(_value))}
                readOnly={props.readOnly}
            />
        </FormField>
    )
}

export default Numeric;

