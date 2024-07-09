import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { isFunction, get, has, isUndefined, isNull } from 'lodash';
import { DataTable } from 'react-native-paper';

interface TabulatedDataOptions {
    // enables only one row footer to be visible at any time
    accordionRowFooters: boolean;
}

const defaultTabulatedDataOptions: TabulatedDataOptions = {
    accordionRowFooters: false
}

interface TabulatedDataProps {
    headerData?: any;
    bodyData: any[];
    actions?: Map<string, CallableFunction>[];
    rowFooters?: any[];
    emptyMessage?: string;
    options?: TabulatedDataOptions;
}

/**
 * onPress
 * onLongPress
 */
export type RecordsetType = {
    [key: string]: string | number | Date | Element
}

export const convertRecordset = ((dataset: RecordsetType[]) => {
    let headerData: string[] = [];
    let bodyData: any[] = [];
    let actions: Map<string, CallableFunction>[] = [];
    let rowFooters: any[] = [];
    for (let record of dataset) {
        if (headerData.length < 1) {
            headerData = Object.keys(record).filter((keyname: string) => ['onPress', 'onShowFooter'].indexOf(keyname) < 0);
        }
        if (has(record, 'onShowFooter')) {
            rowFooters[rowFooters.length] = record.onShowFooter;
        } else {
            rowFooters[rowFooters.length] = null;
        }
        actions[bodyData.length] = new Map();
        let onLongPress = get(record, 'onLongPress') ?? null;
        if (isFunction(get(record, 'onPress'))) {
            actions[bodyData.length].set('onPress', get(record, 'onPress') as CallableFunction);
        }
        if (isFunction(get(record, 'onLongPress'))) {
            actions[bodyData.length].set('onLongPress', get(record, 'onLongPress') as CallableFunction);
        }
        delete record.onPress;
        delete record.onLongPress;
        delete record.onShowFooter;
        bodyData[bodyData.length] = Object.values(record);
    }
    return {
        headerData,
        bodyData,
        actions,
        rowFooters
    }
});

const TabulatedData = (props: TabulatedDataProps) => {

    let options: TabulatedDataOptions = { ...defaultTabulatedDataOptions, ...props.options };

    let actions: Map<string, CallableFunction>[] = props.actions ?? [];

    let rowFooters: any[] = props.rowFooters ?? [];
    let [rowFooterState, setRowFooterState] = useState<boolean[]>([]);

    const canShowRowFooter = (rowIndex: number) => {
        return typeof rowFooterState[rowIndex] === 'boolean' ? rowFooterState[rowIndex] : false;
    }

    const getRowActions = (rowIndex: number) => {
        if (isUndefined(actions[rowIndex])) {
            return {};
        } else {
            let rowActions: any = {};
            if (actions[rowIndex].has('onPress')) {
                rowActions.onPress = actions[rowIndex].get('onPress');
                rowActions.onLongPress = actions[rowIndex].get('onLongPress');
                return rowActions;
            }
        }
    }

    const handleRowOnPress = (rowIndex: number) => {
        let rowActions = getRowActions(rowIndex);
        if (has(rowFooters, rowIndex) && !isNull(rowFooters[rowIndex])) {
            setRowFooterState((_rowFooterState: boolean[]) => {
                let newRowFooterState = [..._rowFooterState];
                newRowFooterState[rowIndex] = !newRowFooterState[rowIndex];

                if (options.accordionRowFooters) {
                    // close all others
                    newRowFooterState = newRowFooterState.map((v: boolean, i: number) => (i === rowIndex && v) || false);
                }
                return newRowFooterState;
            });
        }
        if (!isUndefined(rowActions.onPress)) {
            rowActions.onPress();
        }
    }

    const handleRowOnLongPress = (rowIndex: number) => {
        let rowActions = getRowActions(rowIndex);
        if (!isUndefined(rowActions.onLongPress)) {
            rowActions.onLongPress();
        }
    }

    useEffect(() => {
        setRowFooterState((_rowFooterState: boolean[]) => {
            let newRowFooterState = [..._rowFooterState];
            if (newRowFooterState.length < 1) {
                for (let i = 0; i < props.bodyData.length; i++) {
                    newRowFooterState[i] = false;
                }
            }
            return newRowFooterState;
        });
    }, []);

    return (<>
        {props.bodyData.length < 1
            ? <View style={TabulatedDataStyles.emptyMessageContainer}><Text style={TabulatedDataStyles.emptyMessageText}>{props.emptyMessage ?? 'No records'}</Text></View>
            : <DataTable style={TabulatedDataStyles.tableContainer}>
                {props.headerData && <DataTable.Header style={TabulatedDataStyles.tableHeaderRow}>
                    {props.headerData.map((cellContent: string | number, iKey: number) => <DataTable.Title style={{
                        ...TabulatedDataStyles.tableHeaderCell,
                        ...(iKey === 0 ? TabulatedDataStyles.tableHeaderCellFirst : {}),
                        ...(iKey === props.headerData.length - 1 ? TabulatedDataStyles.tableHeaderCellLast : {})
                    }} key={iKey}>
                        <Text style={{
                            ...TabulatedDataStyles.text,
                            ...TabulatedDataStyles.tableHeaderCellText,
                            ...(iKey === 0 ? TabulatedDataStyles.tableHeaderCellFirstText : {}),
                            ...(iKey === props.headerData.length - 1 ? TabulatedDataStyles.tableHeaderCellLastText : {})
                        }}>{cellContent}</Text>
                    </DataTable.Title>)}
                </DataTable.Header>}

                {props.bodyData.map((bodyData: any, iKey: number) => <DataTable.Row key={iKey}
                    style={TabulatedDataStyles.tableDataRow}
                    onPress={() => handleRowOnPress(iKey)}
                    onLongPress={() => handleRowOnLongPress(iKey)}>

                    {bodyData.map((cellContent: string | number, i2Key: number) => <DataTable.Cell style={{
                        ...TabulatedDataStyles.tableDataCell,
                        ...(i2Key === bodyData.length - 1 ? TabulatedDataStyles.tableDataCellLast : {}),
                        ...(i2Key === 0 ? TabulatedDataStyles.tableDataCellFirst : {}),
                    }} key={i2Key}>
                        <Text style={{
                            ...TabulatedDataStyles.text, ...TabulatedDataStyles.tableDataCellText,
                            ...(i2Key === bodyData.length - 1 ? TabulatedDataStyles.tableDataCellLastText : {}),
                            ...(i2Key === 0 ? TabulatedDataStyles.tableDataCellFirstText : {}),
                        }}>{cellContent}</Text>
                    </DataTable.Cell>)}
                    {canShowRowFooter(iKey) && <View style={TabulatedDataStyles.tableDataRowFooter}>{rowFooters[iKey]}</View>}
                </DataTable.Row>)}

            </DataTable>
        }
    </>)
}

const TabulatedDataStyles = StyleSheet.create({
    emptyMessageContainer: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5
    },
    emptyMessageText: {
        textAlign: 'center'
    },
    tableContainer: {
        display: 'flex',
        flex: 1,
    },
    tableHeaderRow: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'space-between'
    },
    tableHeaderCell: {
        flex: 1,
        padding: 5,
    },
    tableHeaderCellFirst: {
    },
    tableHeaderCellLast: {
        justifyContent: 'flex-end'
    },
    tableHeaderCellFirstText: {
        textAlign: 'left',
    },
    tableHeaderCellLastText: {
        textAlign: 'right',
        flex: 1,
    },
    tableHeaderCellText: {
        fontWeight: 'bold'
    },
    tableBody: {
    },
    tableDataRow: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'space-between',
    },
    tableDataRowFooter: {

    },
    tableDataRowFooterText: {

    },
    tableDataRowEven: {

    },
    tableDataRowOdd: {

    },
    tableDataCell: {
        flex: 1,
    },
    tableDataCellFirst: {
        flex: 2,
    },
    tableDataCellLast: {
    },
    tableDataCellFirstText: {
        textAlign: 'left',
    },
    tableDataCellLastText: {
        textAlign: 'right',
        flex: 1,
    },
    tableDataCellText: {
        padding: 5
    },
    text: {
        fontSize: 20,
        textAlign: "center"
    },
});

export default TabulatedData;