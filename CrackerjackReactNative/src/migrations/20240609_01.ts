import { db } from "../store/database";

export const migrate_20240609_01 = async () => {
    console.log('executing migrate_20240609_01');

    const migrationsTableSql = "CREATE TABLE `migration` (\
        `migrationId` INTEGER PRIMARY KEY AUTOINCREMENT,\
        `filename` VARCHAR(20) NOT NULL DEFAULT '',\
        `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP\
    )";

    (await db).transaction(async (txn: any) => {
        await txn.executeSql(migrationsTableSql, [], () => { }, (error: any) => console.log(error));
    });
}


