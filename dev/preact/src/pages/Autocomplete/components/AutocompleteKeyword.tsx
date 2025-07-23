import type { SearchKeyword } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { useActions } from "@nosto/search-js/preact/hooks"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

type Props = {
  keyword: SearchKeyword
}

export function AutocompleteKeyword({ keyword }: Props) {
  const { newSearch } = useActions()
  const { reportKeywordClick } = useContext(AutocompleteContext)

  const onClick = () => {
    reportKeywordClick(keyword)
    console.log(window.location.pathname.startsWith("/search"))
    if (window.location.pathname.startsWith("/search")) {
      console.log("newSearch")
      newSearch({
        query: keyword.keyword
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
