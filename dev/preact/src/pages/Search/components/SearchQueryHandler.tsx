import { useActions, useSizeOptions } from "@nosto/search-js/preact/hooks"
import { useEffect } from "preact/hooks"

import { defaultConfig, pageSizes } from "../../../defaultConfig"

type Props = {
  urlQuery: Record<string, string>
}

export function SearchQueryHandler({ urlQuery }: Props) {
  const { newSearch } = useActions()
  const { size } = useSizeOptions(pageSizes, defaultConfig.searchPageSize)

  useEffect(() => {
    const searchQuery = urlQuery.q
    if (searchQuery) {
      newSearch({
        query: searchQuery,
        products: {
          size
        }
      })
    }
  }, [newSearch, size, urlQuery])

  return null
}
