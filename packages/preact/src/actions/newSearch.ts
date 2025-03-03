import { search } from "@core/search"
import { Options as SearchConfig } from "@core/types"
import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { applyQueryDefaults } from "@preact/search/defaults"
import { deepMerge } from "@utils/deepMerge"
import { mergeArrays } from "@utils/mergeArrays"
import { measure } from "@utils/performance"

import { cacheSearchResult, loadCachedResultIfApplicable } from "../search/resultCaching"
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

  const usePersistentCache = pageType !== "autocomplete" && context.config.persistentSearchCache
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
    let response: SearchResult

    const cachedValue = loadCachedResultIfApplicable(usePersistentCache, fullQuery)
    if (cachedValue) {
      response = cachedValue
    } else {
      const queryWithDefaults = applyQueryDefaults(pageType, fullQuery)
      response = await search(queryWithDefaults, mergedConfig)
      cacheSearchResult(usePersistentCache, fullQuery, response)
    }

    context.store.updateState({
      response,
      loading: false
    })
  } catch (error) {
    console.error("Search action failed", error)
  }
  end()
}
