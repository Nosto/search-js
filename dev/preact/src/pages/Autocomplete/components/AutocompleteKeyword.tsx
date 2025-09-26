import type { SearchKeyword } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"

type Props = {
  keyword: SearchKeyword
}

export function AutocompleteKeyword({ keyword }: Props) {
  return (
    <>
      <AutocompleteElement
        hit={keyword}
        as="a"
        componentProps={{
          href: `/search/?q=${keyword.keyword}`,
          className: "keyword-row",
          "aria-label": `Keyword ${keyword.keyword}`
        }}
      >
        {keyword.keyword}
      </AutocompleteElement>
    </>
  )
}
