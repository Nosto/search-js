import { search } from "@core/search"
import { Options as SearchConfig } from "@core/types"
import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { type Transformer } from "@preact/hooks/useLoadMore/transform"
import { applyQueryDefaults } from "@preact/search/defaults"
import { deepMerge } from "@utils/deepMerge"
import { measure } from "@utils/performance"

import { cacheSearchResult, loadCachedResultIfApplicable } from "../search/resultCaching"
import applyModifications from "./applyModifications"
import mergeQuery from "./mergeQuery"
import { ActionContext } from "./types"

export type NewSearchOptions = {
  context: ActionContext
  query: SearchQuery
  options?: SearchConfig
}

type DoSearchOptions = Omit<NewSearchOptions, "query"> & {
  mergedQuery: SearchQuery
  queryWithModifications: SearchQuery
  transformer?: Transformer
}

export async function newSearch({ context, query, options }: NewSearchOptions): Promise<void> {
  const end = measure("newSearch")

  const mergedQuery = mergeQuery(context.store.getInitialState().query, query)
  const fullQuery = applyModifications(context, mergedQuery, query)

  await doSearch({ context, mergedQuery, queryWithModifications: fullQuery, options })

  end()
}

export async function doSearch({
  context,
  mergedQuery,
  queryWithModifications,
  options,
  transformer = (query, result) => ({ transformedQuery: query, transformedResult: result })
}: DoSearchOptions) {
  const pageType = context.config.pageType

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

  try {
    let response: SearchResult

    const cachedValue = loadCachedResultIfApplicable(usePersistentCache, queryWithModifications)
    if (cachedValue) {
      response = cachedValue
    } else {
      const queryWithDefaults = applyQueryDefaults(pageType, queryWithModifications)
      const result = await search(queryWithDefaults, mergedConfig)
      const { transformedQuery, transformedResult } = transformer(queryWithModifications, result)
      response = transformedResult
      cacheSearchResult(usePersistentCache, transformedQuery, response)
    }

    context.store.updateState({
      response,
      loading: false
    })
  } catch (error) {
    console.error("Search action failed", error)
  }
}
