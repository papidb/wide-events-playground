// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { groupByTableName, transformRowDataToFieldData } from "../../src/data";
import getDatabase from "../../src/db";

const fetchFields = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getDatabase();
  const tables = (
    await db.all(
      "SELECT column_name, data_type, table_name FROM information_schema.columns"
    )
  ).map(transformRowDataToFieldData);
  return groupByTableName(tables);
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await fetchFields(),
});

function Home() {
  const state = Route.useLoaderData();

  return <div>{JSON.stringify(state)}</div>;
}
