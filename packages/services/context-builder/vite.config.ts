import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "c8",
      reporter: ["text", "lcov"]
    }
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["cjs", "es"]
    },
    outDir: "dist"
  }
});