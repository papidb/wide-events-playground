// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      // @ts-expect-error 
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
