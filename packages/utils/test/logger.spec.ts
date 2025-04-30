import { mockNostojs } from "@nosto/nosto-js/testing"
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { logger } from "../src/logger"

const loggerMock = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
}

const nostoJsMock = (previewMode: boolean) => {
  mockNostojs({
    internal: {
      context: {
        // @ts-expect-error unsafe partial
        mode: {
          isPreview: () => previewMode
        }
      },
      logger: loggerMock
    },
    pageTagging: vi.fn(),
    search: vi.fn(),
    recordSearchClick: vi.fn(),
    recordSearchSubmit: vi.fn()
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Logger with preview (console)", () => {
  beforeAll(() => {
    nostoJsMock(true)
  })

  it("logger.warn", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    logger.warn("warn message")
    expect(warnSpy).toHaveBeenCalledWith("warn message")
    warnSpy.mockRestore()
  })

  it("logger.info", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {})
    logger.info("info message")
    expect(infoSpy).toHaveBeenCalledWith("info message")
    infoSpy.mockRestore()
  })

  it("logger.debug", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {})
    logger.debug("debug message")
    expect(debugSpy).toHaveBeenCalledWith("debug message")
    debugSpy.mockRestore()
  })

  it("logger.error", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.error("error message")
    expect(errorSpy).toHaveBeenCalledWith("error message")
    errorSpy.mockRestore()
  })
})

describe("Logger without preview (Nosto)", () => {
  beforeAll(() => {
    nostoJsMock(false)
  })

  it("logger.warn", () => {
    logger.warn("warn message")
    expect(loggerMock.warn).toHaveBeenCalledWith("warn message")
  })

  it("logger.info", () => {
    logger.info("info message")
    expect(loggerMock.info).toHaveBeenCalledWith("info message")
  })

  it("logger.debug", () => {
    logger.debug("debug message")
    expect(loggerMock.debug).toHaveBeenCalledWith("debug message")
  })

  it("logger.error", () => {
    logger.error("error message")
    expect(loggerMock.error).toHaveBeenCalledWith("error message")
  })
})
