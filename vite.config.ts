import { UserConfig } from "vite"
import { defineConfig } from "vitest/config"

export const baseConfig = {
  build: {
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
