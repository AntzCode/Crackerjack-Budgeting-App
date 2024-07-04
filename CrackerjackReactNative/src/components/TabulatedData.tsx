import React from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';

interface TabulatedDataProps {
    headerData?: any;
    bodyData: any[];
    emptyMessage?: string;
}

export type RecordsetType = {
    [key: string]: string | number | Date | Element
}

export const convertRecordset = ((dataset: RecordsetType[]) => {
    let headerData: string[] = [];
    let bodyData: any[] = [];
    for (let record of dataset) {
        if (headerData.length < 1) {
            headerData = Object.keys(record);
        }
        bodyData[bodyData.length] = Object.values(record);
    }
    return {
        headerData,
        bodyData
    }
});

const TabulatedData = (props: any) => {

    const isDarkMode = useColorScheme() === 'dark';

    return (<>
        {props.bodyData.length < 1
            ? <View style={TabulatedDataStyles.emptyMessageContainer}><Text style={TabulatedDataStyles.emptyMessageText}>{props.emptyMessage ?? 'No records'}</Text></View>
            : <View style={TabulatedDataStyles.tableContainer}>
                {props.headerData && <View style={TabulatedDataStyles.tableHeaderRow}>
                    {props.headerData.map((cellContent: string | number, iKey: number) => <View style={TabulatedDataStyles.tableHeaderCell} key={iKey}>
                        <Text style={{...TabulatedDataStyles.text, ...TabulatedDataStyles.tableHeaderCellText}}>{cellContent}</Text>
                    </View>)}
                </View>}
                <View style={TabulatedDataStyles.tableBody}>
                    {props.bodyData.map((bodyData: any, iKey: number) => <View style={TabulatedDataStyles.tableDataRow} key={iKey}>
                        {bodyData.map((cellContent: string | number, i2Key: number) => <View style={TabulatedDataStyles.tableDataCell} key={i2Key}>
                            <Text style={{...TabulatedDataStyles.text, ...TabulatedDataStyles.tableDataCellText}}>{cellContent}</Text>
                        </View>)}
                    </View>)}
                </View>
            </View>
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
        backgroundColor: 'white',
    },
    tableHeaderRow: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'space-between'
    },
    tableHeaderCell: {
        flex: 1,
        paddingHorizontal: 5,
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
    tableDataRowEven: {

    },
    tableDataRowOdd: {

    },
    tableDataCell: {
        flex: 1,
    },
    tableDataCellText: {
    },
    text: {
        fontSize: 20,
        textAlign: "center"
    },
});

export default TabulatedData;