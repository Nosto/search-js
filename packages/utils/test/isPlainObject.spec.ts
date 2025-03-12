import { isPlainObject } from "@utils/isPlainObject"
import { describe, expect, it } from "vitest"

describe("isPlainObject", () => {
  it("should return true for an empty object", () => {
    expect(isPlainObject({})).toBe(true)
  })

  it("should return true for an object with properties", () => {
    expect(isPlainObject({ name: "John", age: 30 })).toBe(true)
  })

  it("should return false for an array", () => {
    expect(isPlainObject([1, 2, 3])).toBe(false)
  })

  it("should return false for a string", () => {
    expect(isPlainObject("Hello")).toBe(false)
  })

  it("should return false for a number", () => {
    expect(isPlainObject(42)).toBe(false)
  })

  it("should return false for null", () => {
    expect(isPlainObject(null)).toBe(false)
  })

  it("should return false for undefined", () => {
    expect(isPlainObject(undefined)).toBe(false)
  })
})
