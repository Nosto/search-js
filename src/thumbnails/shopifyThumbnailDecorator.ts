import { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { ShopifySize } from "./types"

export type Config = {
  size: ShopifySize
}

const cdnUrlRegex = /cdn\.shopify\.com/

/**
 * Replaces full size images with specified Shopify thumbnail size.
 * This decorator will only affect the image URLs from Shopify CDN.
 */
export function shopifyThumbnailDecorator({ size }: Config) {
  function isUrlFromShopify(url: string | undefined) {
    if (!url) {
      return false
    }

    return new URL(url).hostname.match(cdnUrlRegex)
  }

  function processShopifyUrl(url: string | undefined) {
    if (!url) {
      return ""
    }
    if (!isUrlFromShopify(url)) {
      return url
    }

    return url.replace(/(\.jpg|\.png|\.jpeg|\.gif|\.webp)/, `_${size}$1`)
  }

  function processSkus(skus: SearchProductSku[] | undefined) {
    if (!skus) {
      return undefined
    }
    return skus.map(sku => ({
      ...sku,
      imageUrl: processShopifyUrl(sku.imageUrl)
    }))
  }

  function processAlternateImages(images: string[] | undefined) {
    if (!images) {
      return undefined
    }

    return images.map(image => processShopifyUrl(image))
  }

  return function decorator(hit: SearchProduct): SearchProduct {
    if (!isUrlFromShopify(hit.imageUrl)) {
      return hit
    }

    return {
      ...hit,
      imageUrl: processShopifyUrl(hit.imageUrl),
      thumbUrl: processShopifyUrl(hit.thumbUrl),
      skus: processSkus(hit.skus),
      alternateImageUrls: processAlternateImages(hit.alternateImageUrls)
    }
  }
}
