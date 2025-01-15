import { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { generateThumbnailUrl } from "./generateThumbnailUrl"
import { ThumbnailSize } from "./types"

type Config = {
  merchantId: string
  size: ThumbnailSize
}

type AugmentedSearchProduct = Omit<SearchProduct, "skus"> & {
  skus?: (SearchProductSku & {
    thumbUrl?: string
  })[]
}

/**
 * Replaces full size images with thumbnail sized versions
 */
export function thumbnailDecorator({ merchantId, size }: Config) {
  return function decorator(hit: SearchProduct): AugmentedSearchProduct {
    const productId = hit.productId
    if (!productId) {
      return hit
    }

    const productThumbnail = hit.thumbHash
      ? generateThumbnailUrl({
          merchantId,
          size,
          productId,
          hash: hit.thumbHash
        })
      : undefined

    const updatedSkus =
      hit.skus?.map(sku => {
        // TODO: sku.thumbHash ?
        const hash = sku.imageHash
        if (!hash) {
          return sku
        }
        return {
          ...sku,
          thumbUrl: generateThumbnailUrl({
            merchantId,
            size,
            productId,
            hash
          })
        }
      }) ?? ([] as AugmentedSearchProduct["skus"])

    return {
      ...hit,
      thumbUrl: productThumbnail ?? hit.thumbUrl,
      skus: updatedSkus
    }
  }
}
