import { init } from "@nosto/search-js/preact/inject"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { useEffectOnce } from "../../utils/useEffectOnce"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./components/SearchContentInfinite"
import { SearchContentPaginated } from "./components/SearchContentPaginated"
import { SearchQueryHandler } from "./components/SearchQueryHandler"
import { styles } from "./SearchInjected.styles"

export function SearchInjected() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { query } = useLocation()

  useEffectOnce(() => {
    init({
      serp: {
        config: {
          defaultCurrency: "EUR"
        },
        cssSelector: "#inject-search",
        render: () => (
          <>
            <SearchQueryHandler urlQuery={query} />
            {isInfiniteScrollEnabled ? <SearchContentInfinite /> : <SearchContentPaginated />}
          </>
        )
      }
    })
  })

  return (
    <div className="search" title="Search (Injected)" style={styles.container}>
      <Autocomplete />
      <div id="inject-search" />
    </div>
  )
}
