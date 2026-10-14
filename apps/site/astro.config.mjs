import { defineConfig } from "astro/config";

// Pages build as folder/index.html, so clean URLs (/privacidad) work on any static host.
export default defineConfig({
  output: "static",
});
