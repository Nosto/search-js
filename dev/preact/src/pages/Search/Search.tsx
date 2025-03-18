import { priceDecorator } from "@nosto/search-js/currencies"
import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact"
import { thumbnailDecorator } from "@nosto/search-js/thumbnails"

import { SearchContent } from "./SearchContent"

export const hitDecorators = [thumbnailDecorator({ size: "2" }), priceDecorator({ defaultCurrency: "EUR" })] as const

export function Search() {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies SerpConfig

  return (
    <SearchPageProvider config={config}>
      <SearchContent />
    </SearchPageProvider>
  )
}
