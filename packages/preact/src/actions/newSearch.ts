import { search } from "@core/search"
import { SearchOptions } from "@core/types"
import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { applyQueryDefaults } from "@preact/search/defaults"
import { deepMerge } from "@utils/deepMerge"
import { logger } from "@utils/logger"
import { mergeArrays } from "@utils/mergeArrays"
import { measure } from "@utils/performance"

import { cacheSearchResult, loadCachedResultIfApplicable } from "../search/resultCaching"
import { ActionContext } from "./types"

export async function newSearch(context: ActionContext, query: SearchQuery, options?: SearchOptions): Promise<void> {
  const end = measure("newSearch")

  const pageType = context.config.pageType
  const track = pageType === "search" ? "serp" : pageType

  const mergedQuery = deepMerge(context.store.getInitialState().query, query)
  const mergedOptions = deepMerge(context.config.search, options, {
    track,
    redirect: pageType !== "autocomplete",
    isKeyword: !!options?.isKeyword
  } satisfies SearchOptions)

  try {
    context.config.onBeforeSearch?.(context, mergedOptions)
  } catch (error) {
    return Promise.reject(error)
  }

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
      response = await search(queryWithDefaults, mergedOptions)
      cacheSearchResult(usePersistentCache, fullQuery, response)
    }

    context.store.updateState({
      response,
      loading: false
    })
  } catch (error) {
    logger.error("Search action failed", error)
    context.config.onSearchError?.(error, fullQuery, mergedOptions, pageType)
  }
  end()
}
