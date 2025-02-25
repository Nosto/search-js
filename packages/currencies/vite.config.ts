import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { baseConfig } from "../../vite.config"

export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    lib: {
      ...baseConfig.build.lib,
      entry: resolve(import.meta.dirname, "index.ts"),
      fileName: format => `currencies/currencies.${format}.js`
    }
  }
})
