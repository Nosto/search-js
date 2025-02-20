import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { baseConfig } from "./vite.config"

const entryPoints = ["src/hooks.ts"]

export default defineConfig({
  ...baseConfig,
  build: {
    lib: {
      ...baseConfig.build.lib,
      entry: entryPoints.map(entry => resolve(__dirname, `packages/preact/${entry}`)),
      fileName: (format, name) => `preact/${name}.${format}.js`
    }
  }
})
