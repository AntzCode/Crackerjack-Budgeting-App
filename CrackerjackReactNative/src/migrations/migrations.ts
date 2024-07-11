import { migrate_20240609_00 } from "./20240609_00";
import { migrate_20240609_01 } from "./20240609_01";

export const migrations = new Map<string, CallableFunction>();
migrations.set("20240609_00", migrate_20240609_00);
migrations.set("20240609_01", migrate_20240609_01);




