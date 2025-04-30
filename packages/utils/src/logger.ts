import { nostojs } from "@nosto/nosto-js"

type Level = "debug" | "info" | "warn" | "error"

function createLogger(level: Level) {
  return (...args: unknown[]) => {
    nostojs(api => {
      const logger = api.internal.context.mode.isPreview() ? console[level] : api.internal.logger[level]
      logger(...args)
    })
  }
}

export const logger = {
  debug: createLogger("debug"),
  info: createLogger("info"),
  warn: createLogger("warn"),
  error: createLogger("error")
}
