import { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { generateThumbnailUrl } from "./generateThumbnailUrl"
import { ThumbnailSize } from "./types"

export type Config = {
  size: ThumbnailSize
}

/**
 * Replaces full size images with thumbnail sized versions.
 * Performs the following replacements based on availability of hash fields:
 * - imageHash -> imageUrl
 * - thumbHash -> thumbUrl
 * - alternateImageHashes -> alternateImageUrls
 * - sku.imageHash -> sku.imageUrl
 */
export function thumbnailDecorator({ size }: Config) {
  function getThumbnailUrlForHash(productId: string, hash: string | undefined) {
    if (!hash) {
      return undefined
    }

    return generateThumbnailUrl({
      size,
      productId,
      hash
    })
  }

  function processSkus(productId: string, skus: SearchProductSku[] | undefined) {
    if (!skus) {
      return undefined
    }
    return skus.map(sku => ({
      ...sku,
      imageUrl: getThumbnailUrlForHash(productId, sku.imageHash) ?? sku.imageUrl
    }))
  }

  function processAlternateImages(productId: string, images: string[] | undefined, hashes: string[] | undefined) {
    if (!hashes) {
      return images
    }
    if (!images) {
      return undefined
    }

    return hashes.map(hash =>
      generateThumbnailUrl({
        size,
        productId,
        hash
      })
    )
  }

  return function decorator(hit: SearchProduct): SearchProduct {
    const productId = hit.productId
    if (!productId) {
      return hit
    }

    return {
      ...hit,
      imageUrl: getThumbnailUrlForHash(productId, hit.imageHash) ?? hit.imageUrl,
      thumbUrl: getThumbnailUrlForHash(productId, hit.thumbHash) ?? hit.thumbUrl,
      skus: processSkus(productId, hit.skus),
      alternateImageUrls: processAlternateImages(productId, hit.alternateImageUrls, hit.alternateImageHashes)
    }
  }
}
