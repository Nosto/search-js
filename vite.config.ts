import { resolve } from "path"
import { defineConfig, ViteUserConfig } from "vitest/config"

const entryPointToFolder = {
  core: "packages/core",
  currencies: "packages/currencies",
  preact: "packages/preact",
  thumbnails: "packages/thumbnails"
}
const entryPoints = Object.keys(entryPointToFolder)

export const baseConfig = {
  build: {
    emptyOutDir: false,
    outDir: resolve(import.meta.dirname, "dist"),
    lib: {
      name: "@nosto/search-js",
      formats: ["es", "cjs"],
      entry: entryPoints.map(e => resolve(import.meta.dirname, `${entryPointToFolder[e]}/${e}.ts`)),
      fileName: (format, filename) => `${entryPointToFolder[filename].split("/")[1]}/${filename}.${format}.js`
    },
    rollupOptions: {
      external: ["preact", "preact/hooks"]
    }
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
} satisfies ViteUserConfig

export default defineConfig(baseConfig)
