import { resolve } from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  build: {
    lib: {
      name: "@nosto/search-js",
      entry: [resolve(__dirname, "src/index.ts")],
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format}.js`
    },
    rollupOptions: {
      external: ["@nosto/nosto-js/client", "@nosto/nosto-js"]
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
