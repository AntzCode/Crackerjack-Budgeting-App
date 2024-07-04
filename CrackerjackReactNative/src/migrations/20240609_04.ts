import { db } from "../store/database";

export const migrate_20240609_04 = async () => {
    console.log('executing migrate_20240609_04');
    await db.transaction(async (txn: any) => {
        await txn.executeSql(incomeTableSql, [], () => { }, (error: any) => console.log(error));
    });
}

const incomeTableSql = "CREATE TABLE `income` (\
    `incomeId` INTEGER PRIMARY KEY AUTOINCREMENT,\
    `paymentAmount` REAL NOT NULL DEFAULT 0,\
    `incomeTotal` REAL NOT NULL DEFAULT 0,\
    `paymentCount` INTEGER NULL DEFAULT NULL,\
    `paymentFrequency` VARCHAR(4) NOT NULL DEFAULT 'w',\
    `description` VARCHAR(20) NOT NULL DEFAULT '',\
    `firstPaymentDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\
    `createdDate` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,\
    `deletedDate` DATE NULL DEFAULT NULL,\
    `isRecurring` INTEGER NOT NULL DEFAULT 0,\
    `isIndefinite` INTEGER NOT NULL DEFAULT 1\
)";