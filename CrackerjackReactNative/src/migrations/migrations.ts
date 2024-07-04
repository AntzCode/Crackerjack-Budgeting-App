import { migrate_20240609_00 } from "./20240609_00";
import { migrate_20240609_01 } from "./20240609_01";
import { migrate_20240609_02 } from "./20240609_02";
import { migrate_20240609_03 } from "./20240609_03";
import { migrate_20240609_04 } from "./20240609_04";
import { migrate_20240704_01 } from "./20240704_01";

export const migrations = new Map<string, CallableFunction>();
migrations.set("20240609_00", migrate_20240609_00);
migrations.set("20240609_01", migrate_20240609_01);
migrations.set("20240609_02", migrate_20240609_02);
migrations.set("20240609_03", migrate_20240609_03);
migrations.set("20240609_04", migrate_20240609_04);
migrations.set("20240609_06", migrate_20240704_01);




