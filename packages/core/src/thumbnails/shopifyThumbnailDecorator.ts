import { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"
import { ShopifySize } from "./types"

type NostoSize = keyof typeof sizeMappings

export type Config = {
  size: NostoSize | "orig" | ShopifySize
  fallback?: (hit: SearchProduct) => SearchProduct
}

const cdnUrlRegex = /cdn\.shopify\.com/

const sizeMappings = {
  "1": "170x170_crop_center",
  "2": "100x100_crop_center",
  "3": "90x70_crop_center",
  "4": "50x50_crop_center",
  "5": "30x30_crop_center",
  "6": "100x140_crop_center",
  "7": "200x200_crop_center",
  "8": "400x400",
  "9": "750x750"
}

export function isSupportedNostoSize(size: string): size is NostoSize {
  return size in sizeMappings
}

/**
 * Replaces full size images with specified Nosto or Shopify thumbnail size.
 * This decorator will only affect the image URLs from Shopify CDN.
 * Supports the Nosto size codes "1"-"9" and additionally Shopify specific sizes.
 */
export function shopifyThumbnailDecorator({ size, fallback = v => v }: Config) {
  if (size === "orig") {
    // nothing to convert
    return fallback
  }

  const normalized = sizeMappings[size as NostoSize] || size

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

    return url.replace(/(\.jpg|\.png|\.jpeg|\.gif|\.webp)/, `_${normalized}$1`)
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
      return fallback(hit)
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
