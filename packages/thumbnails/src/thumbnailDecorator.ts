import { nostoThumbnailDecorator } from "./nostoThumbnailDecorator"
import { isSupportedNostoSize, shopifyThumbnailDecorator } from "./shopifyThumbnailDecorator"
import { NostoSize } from "./types"

export type Config = {
  size: NostoSize
}

function isShopify() {
  return window.Nosto?.shopifyScript
}

/**
 * Replaces full size images with thumbnail sized versions.
 * Uses `shopifyThumbnailDecorator` and `nostoThumbnailDecorator` based on the platform.
 */
export function thumbnailDecorator({ size }: Config) {
  const decorator = nostoThumbnailDecorator({ size })

  if (isShopify() && isSupportedNostoSize(size)) {
    return shopifyThumbnailDecorator({ size, fallback: decorator })
  }
  return decorator
}
