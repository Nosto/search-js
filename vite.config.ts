import { resolve } from "path"
import dts from "vite-plugin-dts"
import { defineConfig } from "vitest/config"

const basePackages = ["core", "currencies", "preact", "thumbnails", "utils"]
const preactPackages = ["legacy", "common", "serp", "autocomplete", "category", "hooks"]
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
      include: ["packages/**/*", ...preactPackages.map(name => `packages/preact/${name}.ts`)],
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
        return preactPackages.includes(name)
          ? resolve(import.meta.dirname, `packages/preact/${name}.ts`)
          : resolve(import.meta.dirname, `packages/${name}/${name}.ts`)
      }),
      fileName: (format, filename) => {
        return preactPackages.includes(filename)
          ? `preact/${filename}.${format}.js`
          : `${filename}/${filename}.${format}.js`
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
      "@preact": resolve(import.meta.dirname, "packages/preact/src"),
      "@thumbnails": resolve(import.meta.dirname, "packages/thumbnails/src"),
      "@utils": resolve(import.meta.dirname, "packages/utils/src"),
      "@preact/legacy": resolve(import.meta.dirname, "packages/preact/legacy.ts"),
      "@preact/common": resolve(import.meta.dirname, "packages/preact/common.ts"),
      "@preact/serp": resolve(import.meta.dirname, "packages/preact/serp.ts"),
      "@preact/category": resolve(import.meta.dirname, "packages/preact/category.ts"),
      "@preact/autocomplete": resolve(import.meta.dirname, "packages/preact/autocomplete.ts"),
      "@preact/hooks": resolve(import.meta.dirname, "packages/preact/hooks.ts")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["packages/**/*.spec.ts", "packages/**/*.test.ts", "packages/**/*.spec.tsx", "packages/**/*.test.tsx"]
  }
})
