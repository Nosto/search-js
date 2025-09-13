import { resolve } from "path"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

const basePackages = ["core", "currencies", "thumbnails", "utils"]
const preactPackages = ["autocomplete", "category", "common", "events", "hooks", "inject", "legacy", "serp"]
const packages = [...basePackages, ...preactPackages]

export default defineConfig({
  plugins: [
    dts({
      compilerOptions: {
        rootDir: "packages",
        declaration: true,
        noEmit: false,
        emitDeclarationOnly: true
      },
      include: ["packages/**/*", ...preactPackages.map(name => `packages/preact/${name}/${name}.ts`)],
      exclude: ["dist", "**/vite.config.ts", "**/test", "dev"],
      outDir: "dist"
    })
  ],
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    lib: {
      name: "@nosto/search-js",
      formats: ["es", "cjs"],
      entry: packages.map(name => {
        const prefix = preactPackages.includes(name) ? "preact/" : ""
        return resolve(import.meta.dirname, `packages/${prefix}${name}/${name}.ts`)
      }),
      fileName: (format, filename) => {
        const prefix = preactPackages.includes(filename) ? "preact/" : ""
        return `${prefix}${filename}/${filename}.${format}.js`
      }
    },
    rollupOptions: {
      external: ["preact", "preact/hooks"]
    }
  },
  resolve: {
    alias: [
      { find: /^@core\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/core/src/$1") },
      { find: /^@currencies\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/currencies/src/$1") },
      { find: /^@preact\/autocomplete\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/autocomplete/src/$1") },
      { find: /^@preact\/autocomplete$/, replacement: resolve(import.meta.dirname, "packages/preact/autocomplete/autocomplete.ts") },
      { find: /^@preact\/category\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/category/src/$1") },
      { find: /^@preact\/common\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/common/src/$1") },
      { find: /^@preact\/common$/, replacement: resolve(import.meta.dirname, "packages/preact/common/common.ts") },
      { find: /^@preact\/events\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/events/src/$1") },
      { find: /^@preact\/hooks\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/hooks/src/$1") },
      { find: /^@preact\/inject\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/inject/src/$1") },
      { find: /^@preact\/legacy\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/legacy/src/$1") },
      { find: /^@preact\/serp\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/preact/serp/src/$1") },
      { find: /^@thumbnails\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/thumbnails/src/$1") },
      { find: /^@utils\/(.*)$/, replacement: resolve(import.meta.dirname, "packages/utils/src/$1") },
      { find: /^@utils$/, replacement: resolve(import.meta.dirname, "packages/utils/utils.ts") }
    ]
  },
  test: {
    coverage: {
      include: ["packages/*/src/**/*.{js,ts}"],
      skipFull: true,
      thresholds: {
        statements: 80,
        branches: 80,
        lines: 80,
        functions: 80
      }
    },
    globals: true,
    environment: "jsdom",
    include: ["packages/**/*.spec.ts", "packages/**/*.test.ts", "packages/**/*.spec.tsx", "packages/**/*.test.tsx"]
  }
})
