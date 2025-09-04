import preact from "@preact/preset-vite"
import { defineConfig } from "vitest/config"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    dedupe: ["preact", "preact/hooks"]
  },
  server: {
    port: 8000
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["tests/e2e/**/*"]
  }
})
