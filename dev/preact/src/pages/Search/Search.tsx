import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact/serp"

import { hitDecorators } from "../../utils/hitDecorators"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./SearchContentInfinite"
import { SearchContentPaginated } from "./SearchContentPaginated"
import { SearchQueryHandler } from "./SearchQueryHandler"

export function Search({ infinite = false }: { infinite?: boolean }) {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies SerpConfig

  return (
    <div
      className="search"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <Autocomplete />
      <SearchPageProvider config={config}>
        <SearchQueryHandler />
        {infinite ? <SearchContentInfinite /> : <SearchContentPaginated />}
      </SearchPageProvider>
    </div>
  )
}
