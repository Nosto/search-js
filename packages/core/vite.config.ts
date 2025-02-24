import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { baseConfig } from "../../vite.config"

export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    lib: {
      ...baseConfig.build.lib,
      entry: resolve(import.meta.dirname, "core.ts"),
      fileName: (format, name) => `core/${name}.${format}.js`
    }
  }
})
