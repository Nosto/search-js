import { describe, expect, it } from "vitest"
import { shopifyThumbnailDecorator } from "../../src/thumbnails/shopifyThumbnailDecorator"

describe("shopifyThumbnailDecorator", () => {
  it("keeps non-shopify URLs as is", () => {
    const decorator = shopifyThumbnailDecorator({ size: "thumb" })

    const result = decorator({
      productId: "2222",
      imageUrl: "https://example.com/image1.jpg",
      thumbUrl: "https://example.com/image2.jpg",
      alternateImageUrls: ["https://example.com/image3.jpg"],
      skus: [
        {
          imageUrl: "https://example.com/image4.jpg",
          imageHash: "5555"
        }
      ]
    })

    expect(result.imageUrl).toEqual("https://example.com/image1.jpg")
    expect(result.thumbUrl).toEqual("https://example.com/image2.jpg")
    expect(result.skus![0].imageUrl).toEqual("https://example.com/image4.jpg")
    expect(result.alternateImageUrls![0]).toEqual("https://example.com/image3.jpg")
  })

  it("transforms shopify URLs", () => {
    const decorator = shopifyThumbnailDecorator({ size: "thumb" })

    const shopifyUrl = "https://cdn.shopify.com/s/files/1/0097/5821/2174/files/clothing-red.jpg?v=12345"
    const modifiedUrl = "https://cdn.shopify.com/s/files/1/0097/5821/2174/files/clothing-red_thumb.jpg?v=12345"

    const result = decorator({
      imageUrl: shopifyUrl,
      thumbUrl: shopifyUrl,
      alternateImageUrls: [shopifyUrl],
      skus: [{ imageUrl: shopifyUrl }]
    })

    expect(result.imageUrl).toEqual(modifiedUrl)
    expect(result.thumbUrl).toEqual(modifiedUrl)
    expect(result.skus![0].imageUrl).toEqual(modifiedUrl)
    expect(result.alternateImageUrls![0]).toEqual(modifiedUrl)
  })

  it("supports Nosto size codes", () => {
    const decorator = shopifyThumbnailDecorator({ size: "7" })

    const shopifyUrl = "https://cdn.shopify.com/s/files/1/0097/5821/2174/files/clothing-red.jpg?v=12345"
    const modifiedUrl = "https://cdn.shopify.com/s/files/1/0097/5821/2174/files/clothing-red_200x200_crop_center.jpg?v=12345"

    const result = decorator({
      imageUrl: shopifyUrl
    })

    expect(result.imageUrl).toEqual(modifiedUrl)
  })
})
