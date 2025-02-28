import { NostoSearchPageProvider, SerpConfig } from "@nosto/search-js/preact"

import { SearchContent } from "./SearchContent"

export function Search() {
  const config = {
    merchant: "merchant-id",
    defaultCurrency: "EUR",
    queryModifications: query => query
  } satisfies SerpConfig

  return (
    <NostoSearchPageProvider config={config}>
      <SearchContent />
    </NostoSearchPageProvider>
  )
}
