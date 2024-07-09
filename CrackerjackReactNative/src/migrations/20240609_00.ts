import { db } from "../store/database";

export const migrate_20240609_00 = async () => {
    console.log('executing migrate_20240609_00');
    (await db).transaction(async (txn: any) => {
        await txn.executeSql("DROP TABLE IF EXISTS `migration`", [], () => { }, (error: any) => console.log(error));
        await txn.executeSql("DROP TABLE IF EXISTS `transaction`", [], () => { }, (error: any) => console.log(error));
        await txn.executeSql("DROP TABLE IF EXISTS `expense`", [], () => { }, (error: any) => console.log(error));
        await txn.executeSql("DROP TABLE IF EXISTS `income`", [], () => { }, (error: any) => console.log(error));
        await txn.executeSql("DROP TABLE IF EXISTS `forecast`", [], () => { }, (error: any) => console.log(error));
        
    });
}


