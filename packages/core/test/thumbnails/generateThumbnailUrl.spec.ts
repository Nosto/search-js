import { describe, expect, it } from "vitest"
import { generateThumbnailUrl } from "../../src/thumbnails/generateThumbnailUrl"
import { mockSettings } from "@nosto/nosto-js/testing"

describe("generateThumbnailUrl", () => {
  it("should generate the correct URL", () => {
    mockSettings({
      account: "1111",
      thumbnailHost: "thumbs.nosto.com"
    })
    const url = generateThumbnailUrl({
      size: "2",
      productId: "2222",
      hash: "3333"
    })
    expect(url).toEqual("https://thumbs.nosto.com/1111/2/2222/3333/A")
  })
})
