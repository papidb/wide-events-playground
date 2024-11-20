// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    preset: "vercel",
  },
  vite: {
    plugins: [
      // @ts-expect-error this fails for some reason
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
