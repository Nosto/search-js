import { describe, expect, it } from "vitest"
import { generateThumbnailUrl } from "../../src/thumbnails/generateThumbnailUrl"

describe("generateThumbnailUrl", () => {
  it("should generate the correct URL", () => {
    const url = generateThumbnailUrl({
      merchantId: "1111",
      size: "100x100",
      productId: "2222",
      hash: "3333"
    })
    expect(url).toEqual("https://thumbs.nosto.com/1111/100x100/2222/3333/A")
  })
})
