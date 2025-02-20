import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { baseConfig } from "./vite.config"

const entryPoints = ["src/search.ts", "src/thumbnails.ts", "src/currencies.ts"]

export default defineConfig({
  ...baseConfig,
  build: {
    lib: {
      ...baseConfig.build.lib,
      entry: entryPoints.map(entry => resolve(__dirname, `packages/core/${entry}`)),
      fileName: (format, name) => `core/${name}.${format}.js`
    }
  }
})
