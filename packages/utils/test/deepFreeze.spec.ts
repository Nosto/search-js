import { deepFreeze } from "@utils/deepFreeze"
import { describe, expect, it } from "vitest"

describe("deepFreeze", () => {
  it("should freeze the object", () => {
    const testObject = { a: 1, b: { c: "string" } }
    const result = deepFreeze(testObject)
    expect(result).toEqual(testObject)
    expect(result).not.toBe(testObject)
    expect(() => Object.assign(result, { a: 2 })).toThrow()
    expect(() => Object.assign(result.b, { c: "str" })).toThrow()
  })
})
