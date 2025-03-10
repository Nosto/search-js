import { priceDecorator } from "@nosto/search-js/currencies"
import { NostoSearchPageProvider, SerpConfig } from "@nosto/search-js/preact"
import { thumbnailDecorator } from "@nosto/search-js/thumbnails"
import { DecoratedProduct } from "@nosto/search-js/core/src/types"

import { SearchContent } from "./SearchContent"

export const hitDecorators = [thumbnailDecorator({ size: "2" }), priceDecorator({ defaultCurrency: "EUR" })] as const

export type SearchProduct = DecoratedProduct<typeof hitDecorators>

export function Search() {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies SerpConfig

  return (
    <NostoSearchPageProvider config={config}>
      <SearchContent />
    </NostoSearchPageProvider>
  )
}
