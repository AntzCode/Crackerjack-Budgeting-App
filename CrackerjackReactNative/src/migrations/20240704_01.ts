import { db } from "../store/database";

export const migrate_20240704_01 = async () => {
    console.log('executing migrate_20240704_01');
    (await db).transaction(async (txn: any) => {
        await txn.executeSql(forecastsTableSql, [], () => { }, (error: any) => console.log(error));
    });
}

const forecastsTableSql = "CREATE TABLE `forecast` (\
    `forecastId` INTEGER PRIMARY KEY AUTOINCREMENT,\
    `amount` REAL NOT NULL DEFAULT 0,\
    `balance` REAL NOT NULL DEFAULT 0,\
    `description` VARCHAR(20) NOT NULL DEFAULT '',\
    `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\
    `expenseId` INTEGER NULL DEFAULT NULL,\
    `incomeId` INTEGER NULL DEFAULT NULL\,\
    `paymentCount` INTEGER NOT NULL\
)";



