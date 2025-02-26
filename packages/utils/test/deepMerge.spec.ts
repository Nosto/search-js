import { deepMerge } from "@utils/deepMerge"
import { describe, expect, it } from "vitest"

describe("merge", () => {
  it("merges plain objects correctly", () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it("merges deep objects correctly", () => {
    expect(
      deepMerge(
        {
          deep: {
            foo: 12
          }
        },
        {
          deep: {
            bar: 2
          },
          shallow: 100
        }
      )
    ).toEqual({
      deep: {
        foo: 12,
        bar: 2
      },
      shallow: 100
    })
  })

  it("overrides deep arrays", () => {
    expect(deepMerge({ deep: ["foo"] }, { deep: ["bar"] })).toEqual({
      deep: ["bar"]
    })
  })
})
