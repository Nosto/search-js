import { useActions, useSizeOptions } from "@nosto/search-js/preact/hooks"
import { useEffect } from "preact/hooks"
import { useLocation } from "preact-iso"

import { defaultConfig, pageSizes } from "../../../defaultConfig"

export function SearchQueryHandler() {
  const { url, query } = useLocation()
  const { newSearch } = useActions()
  const { size } = useSizeOptions(pageSizes, defaultConfig.searchPageSize)

  useEffect(() => {
    const userQuery = query.q

    if (userQuery) {
      newSearch({
        query: userQuery,
        products: {
          size
        }
      })
    }
  }, [url, newSearch, size, query])

  return null
}
