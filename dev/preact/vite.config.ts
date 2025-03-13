import preact from "@preact/preset-vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src"
    },
    dedupe: ["preact", "preact/hooks"]
  },
  server: {
    port: 8000
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
})
