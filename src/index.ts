import { serve } from "@hono/node-server";
import { Database } from "duckdb-async";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { groupByTableName, transformRowDataToFieldData } from "./data";
import setupConnection from "./db";

// hacky fix for bigInt
// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
// @ts-expect-error no toJSON method
BigInt.prototype.toJSON = function () {
  return this.toString();
};

let db: Database;

(async () => {
  db = await setupConnection();
})();

const app = new Hono();

app.use(compress());

app.get("/", async (c) => {
  const result = await db.all("SELECT * FROM http_logs LIMIT 1000");
  return c.json(result);
});

app.get("/fields", async (c) => {
  const tables = (
    await db.all(
      "SELECT column_name, data_type, table_name FROM information_schema.columns"
    )
  ).map(transformRowDataToFieldData);
  return c.json(groupByTableName(tables));
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
