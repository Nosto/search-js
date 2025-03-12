import { unique } from "@utils/unique"
import { describe, expect, it } from "vitest"

describe("unique", () => {
  it("returns an array with unique elements", () => {
    const arr = [1, 2, 2, 3, 4, 4, 5]
    const result = unique(arr)
    expect(result).toEqual([1, 2, 3, 4, 5])
  })
})
