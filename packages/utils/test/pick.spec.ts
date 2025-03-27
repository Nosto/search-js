import { pick } from "@utils/pick"
import { describe, expect, it } from "vitest"

describe("pick", () => {
  it("should pick specified properties from an object", () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, "a", "c")
    expect(result).toEqual({ a: 1, c: 3 })
  })

  it("should return an empty object if no properties are specified", () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj)
    expect(result).toEqual({})
  })

  it("should work with nested objects", () => {
    const obj = { a: { nested: true }, b: 2 }
    const result = pick(obj, "a")
    expect(result).toEqual({ a: { nested: true } })
  })
})
