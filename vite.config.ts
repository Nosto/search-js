import { resolve } from "path"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

const basePackages = ["core", "currencies", "thumbnails", "utils"]
const preactPackages = ["autocomplete", "category", "common", "hooks", "inject", "legacy", "serp"]
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
    alias: {
      "@core": resolve(import.meta.dirname, "packages/core/src"),
      "@currencies": resolve(import.meta.dirname, "packages/currencies/src"),
      "@preact/autocomplete": resolve(import.meta.dirname, "packages/preact/autocomplete/src"),
      "@preact/category": resolve(import.meta.dirname, "packages/preact/category/src"),
      "@preact/common": resolve(import.meta.dirname, "packages/preact/common/src"),
      "@preact/hooks": resolve(import.meta.dirname, "packages/preact/hooks/src"),
      "@preact/inject": resolve(import.meta.dirname, "packages/preact/inject/src"),
      "@preact/legacy": resolve(import.meta.dirname, "packages/preact/legacy/src"),
      "@preact/serp": resolve(import.meta.dirname, "packages/preact/serp/src"),
      "@thumbnails": resolve(import.meta.dirname, "packages/thumbnails/src"),
      "@utils": resolve(import.meta.dirname, "packages/utils/src")
    }
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
