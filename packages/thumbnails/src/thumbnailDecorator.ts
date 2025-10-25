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
 *
 * @param config - Configuration object specifying the desired thumbnail size.
 * @returns A decorator function that transforms image URLs to thumbnail versions.
 *
 * @example
 * ```ts
 * import { search } from '@nosto/search-js'
 * import { thumbnailDecorator } from '@nosto/search-js/thumbnails'
 *
 * // Use thumbnail decorator with search
 * const results = await search(
 *   { query: 'shoes' },
 *   {
 *     hitDecorators: [
 *       thumbnailDecorator({ size: '200x200' })
 *     ]
 *   }
 * )
 * console.log(results.products.hits[0].thumb_url)
 *
 * // Available sizes: '100x100', '200x200', '400x400', '600x600', '800x800'
 * const smallThumbs = thumbnailDecorator({ size: '100x100' })
 * const largeThumbs = thumbnailDecorator({ size: '800x800' })
 * ```
 */
export function thumbnailDecorator({ size }: Config) {
  const decorator = nostoThumbnailDecorator({ size })

  if (isShopify() && isSupportedNostoSize(size)) {
    return shopifyThumbnailDecorator({ size, fallback: decorator })
  }
  return decorator
}
