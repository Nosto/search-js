import { priceDecorator } from "@nosto/search-js/currencies"
import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact"
import { thumbnailDecorator } from "@nosto/search-js/thumbnails"

import { InfinityScroll as SearchContentInfinite } from "./Content/InfinityScroll"
import { Paginated as SearchContentPaginated } from "./Content/Paginated"

export const hitDecorators = [thumbnailDecorator({ size: "2" }), priceDecorator({ defaultCurrency: "EUR" })] as const

export function Search({ infinite = false }: { infinite?: boolean }) {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies SerpConfig

  return (
    <SearchPageProvider config={config}>
      {infinite ? <SearchContentInfinite /> : <SearchContentPaginated />}
    </SearchPageProvider>
  )
}
