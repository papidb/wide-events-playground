import { Database } from "duckdb-async";

let db: Database;
export default async function getDatabase() {
  if (db) return db;
  db = await Database.create("http_logs.duckdb");
  return db;
}

// hacky fix for bigInt
// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
// @ts-expect-error no toJSON method
BigInt.prototype.toJSON = function () {
  return this.toString();
};
