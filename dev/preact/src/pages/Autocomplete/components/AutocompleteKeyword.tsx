import type { SearchKeyword } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"

import { keywordRowStyles } from "./AutocompleteKeyword.styles"

type Props = {
  keyword: SearchKeyword
  highlighted?: boolean
}

export function AutocompleteKeyword({ keyword, highlighted = false }: Props) {
  return (
    <>
      <style>{keywordRowStyles}</style>
      <AutocompleteElement
        hit={keyword}
        as="a"
        componentProps={{
          href: `/search/?q=${keyword.keyword}`,
          className: "keyword-row" + (highlighted ? " highlighted" : ""),
          "aria-label": `Keyword ${keyword.keyword}`
        }}
      >
        {keyword.keyword}
      </AutocompleteElement>
    </>
  )
}
