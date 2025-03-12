import { isEqual } from "@utils/isEqual"
import { describe, expect, it } from "vitest"

describe("isEqual", () => {
  it("should return true for equal values", () => {
    // Test case 1
    expect(isEqual(5, 5)).toBe(true)

    // Test case 2
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }
    expect(isEqual(obj1, obj2)).toBe(true)

    // Test case 3
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    expect(isEqual(arr1, arr2)).toBe(true)
  })

  it("should return false for non-equal values", () => {
    // Test case 1
    expect(isEqual(5, 10)).toBe(false)

    // Test case 2
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }
    expect(isEqual(obj1, obj2)).toBe(false)

    // Test case 3
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 4]
    expect(isEqual(arr1, arr2)).toBe(false)
  })
})
