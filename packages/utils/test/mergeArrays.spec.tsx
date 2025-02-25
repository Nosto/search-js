import { mergeArrays } from "@utils/mergeArrays"
import { describe, expect, it } from "vitest"

describe("mergeArrays", () => {
  it("merges arrays correctly", () => {
    expect(mergeArrays(["foo"], ["bar"], ["qip"])).toEqual(["foo", "bar", "qip"])
  })

  it("ignores undefined values", () => {
    expect(mergeArrays(["foo"], undefined, ["qip"])).toEqual(["foo", "qip"])
  })

  it("ignores null values", () => {
    expect(mergeArrays(["foo"], null, ["qip"])).toEqual(["foo", "qip"])
  })

  it("returns undefined if all are undefined or null", () => {
    expect(mergeArrays(undefined, null)).toEqual(undefined)
  })
})
