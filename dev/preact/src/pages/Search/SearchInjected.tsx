import { createPortal } from "preact/compat"
import { useRef } from "preact/hooks"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./components/SearchContentInfinite"
import { SearchContentPaginated } from "./components/SearchContentPaginated"
import { SearchQueryHandler } from "./components/SearchQueryHandler"
import { styles } from "./SearchInjected.styles"

export function SearchInjected() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { query } = useLocation()
  const searchRef = useRef<HTMLDivElement>(null)

  return (
    <div className="search" title="Search (Injected)" style={styles.container}>
      <Autocomplete />
      <div id="inject-search" ref={searchRef}>
        {searchRef.current &&
          createPortal(
            <>
              <SearchQueryHandler urlQuery={query} />
              {isInfiniteScrollEnabled ? <SearchContentInfinite /> : <SearchContentPaginated />}
            </>,
            searchRef.current
          )}
      </div>
    </div>
  )
}
