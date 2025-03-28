import { range } from "@utils/range"
import { describe, expect, it } from "vitest"

describe("range", () => {
  it("should return an array of numbers from start to end - 1", () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4])
  })

  it("should return an empty array if start is equal to end", () => {
    expect(range(5, 5)).toEqual([])
  })

  it("should return an empty array if start is greater than end", () => {
    expect(range(5, 1)).toEqual([])
  })

  it("should return an empty array if start or end is NaN", () => {
    expect(range(NaN, 5)).toEqual([])
    expect(range(5, NaN)).toEqual([])
  })
})
