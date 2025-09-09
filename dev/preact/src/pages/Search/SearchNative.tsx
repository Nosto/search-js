import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact/serp"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./components/SearchContentInfinite"
import { SearchContentPaginated } from "./components/SearchContentPaginated"
import { SearchQueryHandler } from "./components/SearchQueryHandler"
import { styles } from "./SearchNative.styles"

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
    <div className="search" title="Search (Native)" style={styles.container}>
      <Autocomplete />
      <SearchPageProvider config={config}>
        <SearchQueryHandler urlQuery={query} />
        {isInfiniteScrollEnabled ? <SearchContentInfinite /> : <SearchContentPaginated />}
      </SearchPageProvider>
    </div>
  )
}
