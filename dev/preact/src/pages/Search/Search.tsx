import { NostoSearchPageProvider, SerpConfig } from "@nosto/search-js/preact"

import { SearchContent } from "./SearchContent"

export function Search() {
  const config = {
    defaultCurrency: "EUR"
  } satisfies SerpConfig

  return (
    <NostoSearchPageProvider config={config}>
      <SearchContent />
    </NostoSearchPageProvider>
  )
}
