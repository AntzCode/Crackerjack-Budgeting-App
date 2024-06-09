import React, { useState } from 'react';
import { Switch as ReactSwitch, StyleSheet } from 'react-native';

import FormField from './FormField';

interface propsInterface {
    label: string;
    value?: boolean;
    style?: any,
    onValueChange: CallableFunction;
    onTrueContent?: Element | Element[];
    onFalseContent?: Element | Element[];
}

const Switch = (props: propsInterface) => {

    const [isChecked, setIsChecked] = useState<boolean>(props.value ?? false);

    return (
        <FormField horizontal label={props.label} style={props.style ?? {}}
            footerContent={isChecked ? props.onTrueContent : props.onFalseContent}>
            <ReactSwitch
                onValueChange={(value) => (setIsChecked(value), props.onValueChange(value))}
                value={isChecked}
            />
        </FormField>
    )
}

const switchStyles = StyleSheet.create({

});

export default Switch;

