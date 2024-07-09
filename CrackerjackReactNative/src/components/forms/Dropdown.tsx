import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import FormField from './FormField';
import { brandStyles } from '../BrandStyles';
import { Icon } from 'react-native-paper';

export interface DropdownOptionInterface {
    title: string;
    value: string;
}

interface propsInterface {
    label: string;
    value: DropdownOptionInterface;
    options: DropdownOptionInterface[];
    onChangeSelect: CallableFunction;
    style?: any
}

const Dropdown = (props: propsInterface) => {

    const [value, setValue] = useState<DropdownOptionInterface>(props.value);
    const [options, setOptions] = useState<DropdownOptionInterface[]>(props.options);

    return (
        <FormField label={props.label} style={props.style}>
            <SelectDropdown
                defaultValue={value}
                onSelect={(_value) => (setValue(_value), props.onChangeSelect(_value))}
                data={options}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.title) || 'Select one...'}
                            </Text>
                            <Icon source="chevron-down" size={30} />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            />
        </FormField>
    )
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderColor: brandStyles.strongBorder.borderColor,
        borderWidth: brandStyles.strongBorder.borderWidth,
        borderStyle: brandStyles.strongBorder.borderStyle,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
});

export default Dropdown;
