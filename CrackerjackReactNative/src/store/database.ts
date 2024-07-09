
import { useEffect, useState } from 'react';
import { openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { APPLICATION_NAME } from '../constants/system';

import { isDate, isBoolean } from 'lodash';

import { format as dateFormat } from 'date-fns';
import { Alert } from 'react-native';

export const db = openDatabase({
    name: APPLICATION_NAME
});


export const createRecord = async (tablename: string, idColumnName: string, dataset: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        (await db).transaction(async (txn: any) => {
            let keynames = Object.keys(dataset);
            let values = Object.values(dataset).map((value: any) => {
                if (isDate(value)) {
                    value = dateFormat(value, 'yyyy-mm-dd HH:MM:ss');
                }
                if (isBoolean(value)) {
                    value = value ? 1 : 0;
                }
                return value;
            });
            let placeholders = [];
            for (let i = 0; i < keynames.length; i++) { placeholders.push('?'); }
            try {
                let query = "INSERT INTO `" + tablename + "` (`" + keynames.join("`,`") + "`) VALUES (" + placeholders.join(',') + ")";
                await txn.executeSql(query, values, (txn: any, results: any) => resolve({ insertId: results.insertId, rowsAffected: results.rowsAffected }), (error: any) => reject({ error }));
            } catch (e: any) {
                console.log('error while inserting ' + e.message, e);
            }
        });
    });
}



