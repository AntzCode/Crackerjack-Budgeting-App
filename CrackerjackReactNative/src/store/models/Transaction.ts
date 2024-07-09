import { db } from "../database";

export const tablename: string = 'transaction';
export const idColumnName: string = 'transactionId';

export class Transaction {
    transactionId?: number;
    amount: number = 0;
    balance: number = 0;
    description: string = '';
    date: Date = new Date();
    expenseId?: number;
    incomeId?: number;
    paymentCount: number = 1;
}

export const getCurrentBalance = async (): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        (await db).transaction((txn: any) => {
            txn.executeSql("SELECT `balance` FROM `transaction` ORDER BY `date` DESC LIMIT 1", [],
                (status: any, data: any) => {
                    let balance = 0;
                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows.item(i);
                        balance = row['balance'];
                        break;
                    }
                    resolve(balance);
                }, (error: any) => { reject(error) })
        });
    });
}
