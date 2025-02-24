/** @module thumbnails */
export { generateThumbnailUrl, type Props } from "./src/generateThumbnailUrl"
export { thumbnailDecorator, nostoThumbnailDecorator, type Config } from "./src/thumbnailDecorator"
export {
  shopifyThumbnailDecorator,
  type NostoSize,
  type Config as ShopifyConfig
} from "./src/shopifyThumbnailDecorator"
export type { ThumbnailSize, ShopifySize } from "./src/types"
