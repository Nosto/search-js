import { init } from "@nosto/search-js/preact/inject"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { useEffectOnce } from "../../utils/useEffectOnce"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { SearchContentInfinite } from "./components/SearchContentInfinite"
import { SearchContentPaginated } from "./components/SearchContentPaginated"
import { SearchQueryHandler } from "./components/SearchQueryHandler"

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
    <div
      className="search"
      title="Search (Injected)"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <Autocomplete />
      <div id="inject-search" />
    </div>
  )
}
