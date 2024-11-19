import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import {
  groupByTableName,
  transformRowDataToFieldData,
} from "../../../src/data";
import getDatabase from "../../../src/db";

export const Route = createAPIFileRoute("/api/fields")({
  GET: async () => {
    const db = await getDatabase();
    const tables = (
      await db.all(
        "SELECT column_name, data_type, table_name FROM information_schema.columns"
      )
    ).map(transformRowDataToFieldData);
    return json(groupByTableName(tables));
  },
});
