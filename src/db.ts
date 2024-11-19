import { Database } from "duckdb-async";

export default async function setupConnection() {
  let db = await Database.create("http_logs.duckdb");

  return db;
}
