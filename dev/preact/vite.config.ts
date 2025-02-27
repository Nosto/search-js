import preact from "@preact/preset-vite"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    dedupe: ["preact", "preact/hooks"]
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
})
