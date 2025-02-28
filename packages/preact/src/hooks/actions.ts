import type { SearchOptions, SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { ValidConfig } from "@preact/config/config"
import { search } from "@preact/search/search"
import { Store } from "@preact/store"
import { deepMerge } from "@utils/deepMerge"
import { mergeArrays } from "@utils/mergeArrays"
import { measure } from "@utils/performance"

import { logger } from "./logger"
import { cacheSearchResult, loadCachedResultIfApplicable } from "./resultCaching"

type ActionContext = {
  store: Store
  config: ValidConfig
}

export type SearchOptionsWithCustomParams = SearchOptions & { customParams?: Record<string, unknown> }

export async function updateSearch(context: ActionContext, query: SearchQuery, options?: SearchOptions): Promise<void> {
  const end = measure("updateSearch")
  const fullQuery = deepMerge(context.store.getState().query, { products: { from: 0 } }, query)
  const fullOptions = deepMerge({ customParams: context.store.getState().customParams }, options)

  await newSearch(context, fullQuery, fullOptions)
  end()
}

export async function newSearch(
  context: ActionContext,
  query: SearchQuery,
  options?: SearchOptionsWithCustomParams
): Promise<void> {
  const end = measure("newSearch")
  // TODO: Error session handling
  //   if (context.config.fallback && isErrorSession()) {
  //     const rejectError = new Error("Search API is in error state")
  //     // logger.error(rejectError)
  //     return Promise.reject(rejectError)
  //   }

  const mergedQuery = deepMerge(context.store.getInitialState().query, query)
  context.store.updateState({
    query: mergedQuery,
    loading: true,
    initialized: true,
    customParams: options?.customParams || {}
  })
  const pageType = context.config.pageType
  const isKeyword = !!options?.isKeyword
  const usePersistentCache = pageType !== "autocomplete" && !!context.config.persistentSearchCache
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
  const searchConfig = (() => {
    if (context.config.pageType === "search") {
      return context.config.search
    }
    return undefined
  })()

  try {
    let response: SearchResult

    const cachedValue = loadCachedResultIfApplicable(usePersistentCache, fullQuery)
    if (cachedValue) {
      response = cachedValue
    } else {
      response = await search({ pageType, isKeyword, ...searchConfig }, fullQuery)
      cacheSearchResult(usePersistentCache, fullQuery, response)
    }

    // TODO - add test, if state is committed to component correctly when search time is immediate (e.g with mocked search).
    context.store.updateState({
      response,
      loading: false
    })
  } catch (error) {
    // TODO: Fallback logic
    logger.error("New search failed", error)
    // if (context.config.fallback && pageType && pageType !== "autocomplete") {
    //   if (shouldFallback(error)) {
    //     handleFallback(context.config, fullQuery)
    //   } else {
    //     logger.info("Skipping fallback logic for ", error)
    //   }
    // }
  }
  end()
}
