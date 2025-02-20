import { resolve } from "path"
import { defineConfig } from "vitest/config"

const entryPoints = ["core/src/search.ts", "core/src/thumbnails.ts", "core/src/currencies.ts"]

export default defineConfig({
  build: {
    lib: {
      name: "@nosto/search-js",
      entry: entryPoints.map(entry => resolve(__dirname, `packages/${entry}`)),
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format}.js`
    }
  },
  server: {
    port: 8080
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
})
