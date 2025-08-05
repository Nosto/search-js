import { useActions, useSizeOptions } from "@nosto/search-js/preact/hooks"

import { defaultConfig, pageSizes } from "../../../defaultConfig"
import { useEffectOnce } from "../../../utils/useEffectOnce"

type Props = {
  urlQuery: Record<string, string>
}

export function SearchQueryHandler({ urlQuery }: Props) {
  const { newSearch } = useActions()
  const { size } = useSizeOptions(pageSizes, defaultConfig.searchPageSize)

  useEffectOnce(() => {
    const searchQuery = urlQuery.q
    if (searchQuery) {
      newSearch({
        query: searchQuery,
        products: {
          size
        }
      })
    }
  })

  return null
}
