import type { SearchKeyword } from "@nosto/nosto-js/client"
import { AutocompleteElement } from "@nosto/search-js/preact/autocomplete"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

type Props = {
  keyword: SearchKeyword
}

export function AutocompleteKeyword({ keyword }: Props) {
  const { handleSubmit } = useContext(AutocompleteContext)

  const onClick = () => {
    handleSubmit({ query: keyword.keyword })
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
