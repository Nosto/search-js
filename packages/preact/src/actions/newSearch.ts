import { Options as SearchConfig } from "@core/types"
import type { SearchQuery } from "@nosto/nosto-js/client"
import { searchWithCachePrefill } from "@preact/search/searchWithCachePrefill"
import { deepMerge } from "@utils/deepMerge"
import { mergeArrays } from "@utils/mergeArrays"
import { measure } from "@utils/performance"

import { ActionContext } from "./types"

export async function newSearch(context: ActionContext, query: SearchQuery, options?: SearchConfig): Promise<void> {
  const end = measure("newSearch")

  const pageType = context.config.pageType
  const mergedQuery = deepMerge(context.store.getInitialState().query, query)
  const mergedConfig = deepMerge(context.config.search, options, {
    track: pageType,
    redirect: pageType !== "autocomplete",
    isKeyword: !!options?.isKeyword
  })

  context.store.updateState({
    query: mergedQuery,
    loading: true,
    initialized: true
  })

  const fullQuery = context.config.queryModifications(
    {
      ...mergedQuery,
      products: {
        ...mergedQuery.products,
        // Apply filter merging to avoid overwriting base filters
        filter: mergeArrays(context.store.getInitialState().query?.products?.filter, query.products?.filter)
      }
    },
    pageType
  )

  try {
    const response = await searchWithCachePrefill(context.config, fullQuery, mergedConfig)

    context.store.updateState({
      response,
      loading: false
    })
  } catch (error) {
    console.error("Search action failed", error)
  }
  end()
}
