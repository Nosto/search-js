import { resolve } from "path"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

const packages = ["core", "currencies", "preact", "thumbnails"]

export default defineConfig({
  plugins: [
    dts({
      compilerOptions: {
        rootDir: "packages",
        declaration: true,
        noEmit: false,
        emitDeclarationOnly: true
      },
      exclude: ["dist", "**/vite.config.ts", "**/test", "dev"]
    })
  ],
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
  resolve: {
    alias: {
      "@core": resolve(import.meta.dirname, "packages/core/src"),
      "@currencies": resolve(import.meta.dirname, "packages/currencies/src"),
      "@preact": resolve(import.meta.dirname, "packages/preact/src"),
      "@thumbnails": resolve(import.meta.dirname, "packages/thumbnails/src"),
      "@utils": resolve(import.meta.dirname, "packages/utils/src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["packages/**/*.spec.ts", "packages/**/*.test.ts", "packages/**/*.spec.tsx", "packages/**/*.test.tsx"]
  }
})
