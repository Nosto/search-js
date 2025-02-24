import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { baseConfig } from "../../vite.config"

export default defineConfig({
  ...baseConfig,
  build: {
    ...baseConfig.build,
    lib: {
      ...baseConfig.build.lib,
      entry: resolve(import.meta.dirname, "preact.ts"),
      fileName: (format, name) => `preact/${name}.${format}.js`
    },
    rollupOptions: {
      external: ["preact", "preact/hooks"]
    }
  }
})
