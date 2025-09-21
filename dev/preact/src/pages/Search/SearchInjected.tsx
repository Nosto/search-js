import { SearchPageProvider, SerpConfig } from "@nosto/search-js/preact/serp"
import { createPortal } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./components/SearchContentInfinite"
import { SearchContentPaginated } from "./components/SearchContentPaginated"
import { SearchQueryHandler } from "./components/SearchQueryHandler"
import { styles } from "./SearchInjected.styles"

export function SearchInjected() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { query } = useLocation()
  const [searchContainer, setSearchContainer] = useState<Element | null>(null)

  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies SerpConfig

  // Initialize search container
  useEffect(() => {
    const container = document.getElementById("inject-search")
    if (container) {
      setSearchContainer(container)
    }
  }, [])

  return (
    <div className="search" title="Search (Injected)" style={styles.container}>
      <Autocomplete />
      <div id="inject-search" />

      {/* Render search content via portal into the search container */}
      {searchContainer &&
        createPortal(
          <SearchPageProvider config={config}>
            <SearchQueryHandler urlQuery={query} />
            {isInfiniteScrollEnabled ? <SearchContentInfinite /> : <SearchContentPaginated />}
          </SearchPageProvider>,
          searchContainer
        )}
    </div>
  )
}
