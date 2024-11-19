import { jsx } from "hono/jsx";

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Database } from "duckdb-async";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { html, raw } from "hono/html";
import { groupByTableName, transformRowDataToFieldData } from "./data";
import setupConnection from "./db";
import { Hello } from "./pages/home";

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

const isProd = process.env.NODE_ENV === "production";

const manifestPath = "../dist/.vite/manifest.json";
const cssFile = isProd
  ? (await import(manifestPath)).default["src/pages/index.tsx"]?.css?.at(0)
  : null;

app.use("/assets/*", serveStatic({ root: "./dist" }));

app.get("/", (c) => {
  const content = jsx(Hello, {}); // <-- HERE IS our JSX content
  return c.html(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Wide Events Playground</title>
        ${cssFile ? raw(`<link rel="stylesheet" href="${cssFile}">`) : null}
      </head>
      <body>
        ${content}
        ${isProd
          ? null
          : raw(`<script
                type="module"
                src="http://localhost:5174/@vite/client"
            ></script>
            <script
                type="module"
                src="http://localhost:5174/src/pages/index.tsx"
            ></script>`)}
      </body>
    </html>
  `);
});

app.get("/fields", async (c) => {
  const tables = (
    await db.all(
      "SELECT column_name, data_type, table_name FROM information_schema.columns"
    )
  ).map(transformRowDataToFieldData);
  return c.json(groupByTableName(tables));
});

const port = process.env.PORT || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
