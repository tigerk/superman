import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./swagger.json",
  output: {
    path: "./src/types/generated",
    clean: true
  },
  plugins: [
    {
      name: "@hey-api/typescript",
      enums: false
    }
  ]
});
