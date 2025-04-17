import { SearchQuery } from "@nosto/nosto-js/client"
import { mergeArrays } from "@utils/mergeArrays"

import { ActionContext } from "./types"

export default function applyModifications(
  { config, store }: ActionContext,
  mergedQuery: SearchQuery,
  currentQuery: SearchQuery
): SearchQuery {
  return config.queryModifications(
    {
      ...mergedQuery,
      products: {
        ...mergedQuery.products,
        // Apply filter merging to avoid overwriting base filters
        filter: mergeArrays(store.getInitialState().query?.products?.filter, currentQuery.products?.filter)
      }
    },
    config.pageType
  )
}
