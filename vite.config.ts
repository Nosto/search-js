import { resolve } from "path"
import { defineConfig, ViteUserConfig } from "vitest/config"

const packages = ["core", "currencies", "preact", "thumbnails"]

export const baseConfig = {
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    lib: {
      name: "@nosto/search-js",
      formats: ["es", "cjs"],
      entry: packages.map(name => resolve(import.meta.dirname, `packages/${name}/${name}.ts`)),
      fileName: (format, filename) => `${filename}/${filename}.${format}.js`
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
