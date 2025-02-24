import { defineConfig, ViteUserConfig } from "vitest/config"

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
} satisfies ViteUserConfig

export default defineConfig(baseConfig)
