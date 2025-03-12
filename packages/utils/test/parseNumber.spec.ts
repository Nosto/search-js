import { describe, expect, it } from "vitest"

import parseNumber from "../src/parseNumber"

describe("parseNumber", () => {
  it("should return the number if the input is a number", () => {
    expect(parseNumber(42)).toBe(42)
    expect(parseNumber(3.14)).toBe(3.14)
    expect(parseNumber(-10)).toBe(-10)
  })

  it("should return the parsed number if the input is a string representing a number", () => {
    expect(parseNumber("42")).toBe(42)
    expect(parseNumber("3.14")).toBe(3.14)
    expect(parseNumber("-10")).toBe(-10)
  })

  it("should return undefined if the input is not a number or a string", () => {
    expect(parseNumber(true)).toBeUndefined()
    expect(parseNumber(null)).toBeUndefined()
    expect(parseNumber(undefined)).toBeUndefined()
    expect(parseNumber({})).toBeUndefined()
    expect(parseNumber([])).toBeUndefined()
  })

  it("should return undefined if the input string is not a valid number", () => {
    expect(parseNumber("abc")).toBeUndefined()
    expect(parseNumber("1.2.3")).toBeUndefined()
    expect(parseNumber("10px")).toBeUndefined()
  })
})
