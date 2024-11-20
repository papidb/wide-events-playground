// app/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { groupByTableName, transformRowDataToFieldData } from "../utils/data";
import getDatabase from "../utils/db";


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

  //   return <div>{JSON.stringify(state)}</div>;
  return (
    <div
      hx-boost="true"
      className="flex flex-col items-center justify-center h-screen text-center"
    >
      <h1 className="text-red-500">Hello World!</h1>
      <button hx-get="/data" hx-target="#data-container">
        Fetch Data
      </button>
      <div className="mt-8" id="data-container">
        No data fetched yet...
      </div>
    </div>
  );
}
