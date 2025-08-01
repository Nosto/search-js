import type { SearchKeyword } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { StoreContext } from "@nosto/search-js/preact/common"
import { useEventBusDispatch } from "@nosto/search-js/preact/events"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

type Props = {
  keyword: SearchKeyword
}

export function AutocompleteKeyword({ keyword }: Props) {
  const { updateState } = useContext(StoreContext)
  const { reportKeywordClick } = useContext(AutocompleteContext)
  const triggerNewSearch = useEventBusDispatch({ event: "actions/newSearch" })

  const onClick = () => {
    reportKeywordClick(keyword)
    updateState({ query: { query: keyword.keyword } })
    if (window.location.pathname.startsWith("/search")) {
      triggerNewSearch({
        query: {
          query: keyword.keyword
        },
        targetStore: "search"
      })
    }
  }

  return (
    <>
      <AutocompleteElement
        hit={keyword}
        as="a"
        componentProps={{
          href: `/search/?q=${keyword.keyword}`,
          onClick,
          className: "keyword-row",
          "aria-label": `Keyword ${keyword.keyword}`
        }}
      >
        {keyword.keyword}
      </AutocompleteElement>
    </>
  )
}
