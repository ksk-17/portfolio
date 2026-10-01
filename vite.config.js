import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/portfolio/",
  plugins: [react()],
  esbuild: { jsx: "automatic" },
  test: { environment: "jsdom", globals: true, setupFiles: "./src/test/setup.js", css: false },
});
