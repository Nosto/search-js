import { priceDecorator } from "@nosto/search-js/currencies"
import { thumbnailDecorator } from "@nosto/search-js/thumbnails"

export const hitDecorators = [thumbnailDecorator({ size: "10" }), priceDecorator({ defaultCurrency: "EUR" })] as const
