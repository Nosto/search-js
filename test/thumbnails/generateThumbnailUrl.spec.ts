import { describe, expect, it } from "vitest"
import { generateThumbnailUrl } from "../../src/thumbnails/generateThumbnailUrl"
import { mockSettings } from "@nosto/nosto-js/testing"

describe("generateThumbnailUrl", () => {
  it("should generate the correct URL", () => {
    mockSettings({
      account: "1111"
    })
    const url = generateThumbnailUrl({
      size: "100x100",
      productId: "2222",
      hash: "3333"
    })
    expect(url).toEqual("https://thumbs.nosto.com/1111/100x100/2222/3333/A")
  })
})
