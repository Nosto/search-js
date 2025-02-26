/** @module thumbnails */
export { generateThumbnailUrl, type Config as GenerateThumbnailUrlConfig } from "./src/generateThumbnailUrl"
export { nostoThumbnailDecorator, type Config as NostoThumbnailDecoratorConfig } from "./src/nostoThumbnailDecorator"
export {
  shopifyThumbnailDecorator,
  type Config as ShopifyThumbnailDecoratorConfig
} from "./src/shopifyThumbnailDecorator"
export { thumbnailDecorator, type Config as ThumbnailDecoratorConfig } from "./src/thumbnailDecorator"
export type { NostoShopifySize, NostoSize, ShopifySize } from "./src/types"
