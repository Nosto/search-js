import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact/serp"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./SearchContentInfinite"
import { SearchContentPaginated } from "./SearchContentPaginated"
import { SearchQueryHandler } from "./SearchQueryHandler"

export function Search() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()

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
        {isInfiniteScrollEnabled ? <SearchContentInfinite /> : <SearchContentPaginated />}
      </SearchPageProvider>
    </div>
  )
}
