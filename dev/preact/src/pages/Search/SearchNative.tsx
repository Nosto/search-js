import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact/serp"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./components/SearchContentInfinite"
import { SearchContentPaginated } from "./components/SearchContentPaginated"
import { SearchQueryHandler } from "./components/SearchQueryHandler"

export function SearchNative() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { query } = useLocation()

  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies SerpConfig

  return (
    <div
      className="search"
      title="Search (Native)"
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
        <SearchQueryHandler urlQuery={query} />
        {isInfiniteScrollEnabled ? <SearchContentInfinite /> : <SearchContentPaginated />}
      </SearchPageProvider>
    </div>
  )
}
