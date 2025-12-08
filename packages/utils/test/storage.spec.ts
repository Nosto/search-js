import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { logger } from "../src/logger"
import * as storage from "../src/storage"

// Store original storage references
const originalLocalStorage = window.localStorage
const originalSessionStorage = window.sessionStorage

describe("storage", () => {
  beforeEach(() => {
    // Restore original storage before each test
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
      configurable: true,
      writable: true
    })
    Object.defineProperty(window, "sessionStorage", {
      value: originalSessionStorage,
      configurable: true,
      writable: true
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("setLocalStorageItem", () => {
    it("should store a value in localStorage", () => {
      storage.setLocalStorageItem("nosto:search-js:test", { foo: "bar" })
      const stored = window.localStorage.getItem("nosto:search-js:test")
      expect(stored).toBe('{"foo":"bar"}')
    })

    it("should handle localStorage.setItem throwing an error", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      const error = new Error("QuotaExceededError")
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw error
      })

      storage.setLocalStorageItem("nosto:search-js:test", { foo: "bar" })

      expect(warnSpy).toHaveBeenCalledWith(error)
    })
  })

  describe("getLocalStorageItem", () => {
    it("should retrieve a value from localStorage", () => {
      window.localStorage.setItem("nosto:search-js:test", '{"foo":"bar"}')
      const result = storage.getLocalStorageItem<{ foo: string }>("nosto:search-js:test")
      expect(result).toEqual({ foo: "bar" })
    })

    it("should return undefined if item does not exist", () => {
      const result = storage.getLocalStorageItem("nosto:search-js:nonexistent")
      expect(result).toBeUndefined()
    })

    it("should handle localStorage.getItem throwing an error", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      const error = new Error("Storage access blocked")
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw error
      })

      const result = storage.getLocalStorageItem("nosto:search-js:test")

      expect(result).toBeUndefined()
      expect(warnSpy).toHaveBeenCalledWith(error)
    })

    it("should handle invalid JSON in storage", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      window.localStorage.setItem("nosto:search-js:test", "invalid json{")

      const result = storage.getLocalStorageItem("nosto:search-js:test")

      expect(result).toBeUndefined()
      expect(warnSpy).toHaveBeenCalled()
    })
  })

  describe("removeLocalStorageItem", () => {
    it("should remove a value from localStorage", () => {
      window.localStorage.setItem("nosto:search-js:test", '{"foo":"bar"}')
      storage.removeLocalStorageItem("nosto:search-js:test")
      const stored = window.localStorage.getItem("nosto:search-js:test")
      expect(stored).toBeNull()
    })

    it("should handle localStorage.removeItem throwing an error", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      const error = new Error("Storage access blocked")
      vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw error
      })

      storage.removeLocalStorageItem("nosto:search-js:test")

      expect(warnSpy).toHaveBeenCalledWith(error)
    })
  })

  describe("setSessionStorageItem", () => {
    it("should store a value in sessionStorage", () => {
      storage.setSessionStorageItem("nosto:search-js:test", { foo: "bar" })
      const stored = window.sessionStorage.getItem("nosto:search-js:test")
      expect(stored).toBe('{"foo":"bar"}')
    })

    it("should handle sessionStorage.setItem throwing an error", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      const error = new Error("QuotaExceededError")
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw error
      })

      storage.setSessionStorageItem("nosto:search-js:test", { foo: "bar" })

      expect(warnSpy).toHaveBeenCalledWith(error)
    })
  })

  describe("getSessionStorageItem", () => {
    it("should retrieve a value from sessionStorage", () => {
      window.sessionStorage.setItem("nosto:search-js:test", '{"foo":"bar"}')
      const result = storage.getSessionStorageItem<{ foo: string }>("nosto:search-js:test")
      expect(result).toEqual({ foo: "bar" })
    })

    it("should return undefined if item does not exist", () => {
      const result = storage.getSessionStorageItem("nosto:search-js:nonexistent")
      expect(result).toBeUndefined()
    })

    it("should handle sessionStorage.getItem throwing an error", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      const error = new Error("Storage access blocked")
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw error
      })

      const result = storage.getSessionStorageItem("nosto:search-js:test")

      expect(result).toBeUndefined()
      expect(warnSpy).toHaveBeenCalledWith(error)
    })
  })

  describe("removeSessionStorageItem", () => {
    it("should remove a value from sessionStorage", () => {
      window.sessionStorage.setItem("nosto:search-js:test", '{"foo":"bar"}')
      storage.removeSessionStorageItem("nosto:search-js:test")
      const stored = window.sessionStorage.getItem("nosto:search-js:test")
      expect(stored).toBeNull()
    })

    it("should handle sessionStorage.removeItem throwing an error", () => {
      const warnSpy = vi.spyOn(logger, "warn")
      const error = new Error("Storage access blocked")
      vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw error
      })

      storage.removeSessionStorageItem("nosto:search-js:test")

      expect(warnSpy).toHaveBeenCalledWith(error)
    })
  })

  describe("storage initialization with blocked access", () => {
    it("should fallback to in-memory storage when localStorage access throws", async () => {
      // Mock window.localStorage to throw when accessed (blocked cookies scenario)
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("localStorage is not available")
        },
        configurable: true
      })

      // Re-import the module to trigger initialization with blocked storage
      vi.resetModules()
      const storageModule = await import("../src/storage")

      storageModule.setLocalStorageItem("nosto:search-js:test", { foo: "bar" })
      const result = storageModule.getLocalStorageItem<{ foo: string }>("nosto:search-js:test")

      expect(result).toEqual({ foo: "bar" })
    })

    it("should support sessionStorage operations with in-memory fallback", async () => {
      // Mock window.localStorage and sessionStorage to throw
      Object.defineProperty(window, "sessionStorage", {
        get() {
          throw new Error("sessionStorage is not available")
        },
        configurable: true
      })

      // Re-import the module to trigger initialization with blocked storage
      vi.resetModules()
      const storageModule = await import("../src/storage")

      storageModule.setSessionStorageItem("nosto:search-js:session", {
        session: "data"
      })
      const sessionResult = storageModule.getSessionStorageItem<{
        session: string
      }>("nosto:search-js:session")

      expect(sessionResult).toEqual({ session: "data" })
    })

    it("should support remove operations with in-memory fallback", async () => {
      // Mock window.localStorage to throw
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("localStorage is not available")
        },
        configurable: true
      })

      // Re-import the module to trigger initialization with blocked storage
      vi.resetModules()
      const storageModule = await import("../src/storage")

      storageModule.setLocalStorageItem("nosto:search-js:test", { foo: "bar" })
      storageModule.removeLocalStorageItem("nosto:search-js:test")
      const removedResult = storageModule.getLocalStorageItem("nosto:search-js:test")

      expect(removedResult).toBeUndefined()
    })
  })

  describe("complex data types", () => {
    it("should handle nested objects", () => {
      const complexData = {
        nested: {
          deep: {
            value: "test"
          }
        },
        array: [1, 2, 3]
      }

      storage.setLocalStorageItem("nosto:search-js:complex", complexData)
      const result = storage.getLocalStorageItem<typeof complexData>("nosto:search-js:complex")

      expect(result).toEqual(complexData)
    })

    it("should handle arrays", () => {
      const arrayData = [{ id: 1 }, { id: 2 }, { id: 3 }]

      storage.setSessionStorageItem("nosto:search-js:array", arrayData)
      const result = storage.getSessionStorageItem<typeof arrayData>("nosto:search-js:array")

      expect(result).toEqual(arrayData)
    })

    it("should handle primitive values", () => {
      storage.setLocalStorageItem("nosto:search-js:string", "test string")
      storage.setLocalStorageItem("nosto:search-js:number", 42)
      storage.setLocalStorageItem("nosto:search-js:boolean", true)

      expect(storage.getLocalStorageItem<string>("nosto:search-js:string")).toBe("test string")
      expect(storage.getLocalStorageItem<number>("nosto:search-js:number")).toBe(42)
      expect(storage.getLocalStorageItem<boolean>("nosto:search-js:boolean")).toBe(true)
    })
  })
})
