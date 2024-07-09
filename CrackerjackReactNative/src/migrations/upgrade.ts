
import { MainBundlePath, copyFile, copyFileAssets } from "react-native-fs";
import { db } from "../store/database";
import { Platform } from "react-native";
import { migrations } from './migrations';

const cpassets = (source: string, destination: string): Promise<void> =>
    Platform.OS === 'ios'
        ? copyFile(`${MainBundlePath}/${source}`, destination)
        : copyFileAssets(source, destination);

export const autoUpgrade = async () => {

    console.log('Perform auto-upgrade...');

    let latestMigration: string | undefined = undefined;

    (await db).transaction(async (txn: any) => await txn.executeSql('SELECT * FROM migration ORDER BY filename ASC', [],
        async (sqlTxn: any, res: any) => {
            for (let i = 0; i < res.rows.length; i++) {
                latestMigration = res.rows.item(i).filename;
            }
            if (latestMigration !== undefined) {
                let [_date, _iteration] = latestMigration.split('_');
                let minMigration = _date + '_' + (Number.parseInt(_iteration) + 1);
                await applyUpgrades(minMigration);
            } else {
                console.log('not installed! ... I will install it now...');
                await applyUpgrades();
            }
        },
        async (error: any) => {
            console.log('I will apply upgrades');
            await applyUpgrades();
        }
    ))
}

export const applyUpgrades = async (min?: string, max?: string) => {

    console.log('apply upgrades begins');

    let migrationsToApply = [...migrations.keys()].filter((migration: string) => {
        let isValid = true;
        if (min !== undefined && min.localeCompare(migration) > 0) {
            isValid = false;
        }
        if (max !== undefined && max.localeCompare(migration) < 0) {
            isValid = false;
        }
        return isValid;
    });

    console.log('migrations to apply: ', migrationsToApply);

    for (let migration of migrationsToApply) {
        let callableMigration = migrations.get(migration);
        if (typeof callableMigration === 'function') {
            await callableMigration();
            (await db).transaction(async (txn: any) => {
                await txn.executeSql("INSERT INTO `migration` (`filename`, `date`) VALUES (:filename, :date)",
                    [migration, new Date().toUTCString()],
                    () => { },
                    (error: any) => console.log('it got an error while trying to insert the migration record ', error)
                )
            });
        }
    }
}
