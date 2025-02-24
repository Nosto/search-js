import { defineConfig, UserConfig } from "vite"

export const baseConfig = {
  build: {
    emptyOutDir: false,
    outDir: "dist",
    lib: {
      name: "@nosto/search-js",
      formats: ["es", "cjs"],
      entry: [] // Overriden per package
    }
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
} satisfies UserConfig

export default defineConfig(baseConfig)
