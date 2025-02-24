import { describe, it, expect } from "vitest"
import { shouldRetry } from "../src/searchWithRetries"

describe("shouldRetry", () => {
  it("should return true for an error without status", () => {
    expect(shouldRetry({ message: "Some error" })).toBe(true)
  })

  it("should return true for an error with status 200 or 500", () => {
    expect(shouldRetry({ status: 200 })).toBe(true)
    expect(shouldRetry({ status: 500 })).toBe(true)
  })

  it("should return false for an error with status 400 or 403", () => {
    expect(shouldRetry({ status: 400 })).toBe(false)
    expect(shouldRetry({ status: 403 })).toBe(false)
  })

  it("should return false for a falsy error", () => {
    expect(shouldRetry(null)).toBe(false)
    expect(shouldRetry(undefined)).toBe(false)
  })
})
