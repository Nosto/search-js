import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { ActionContext } from "@preact/actions/types"
import { Store } from "@preact/store"

import { cachePaginatedResult, loadPaginatedResultFromCache } from "./pagedCaching"
import { cacheResult, loadResultFromCache } from "./simpleCaching"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

export type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

export function cacheSearchResult({ config, store }: ActionContext, query: SearchQuery, result: SearchResult) {
  const usePersistentSearchCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  if (isPaginatedResult(store, usePersistentSearchCache)) {
    cachePaginatedResult(usePersistentSearchCache, query, result)
  } else {
    cacheResult(usePersistentSearchCache, query, result)
  }
}

export function loadCachedResultIfApplicable({ config, store }: ActionContext, query: SearchQuery) {
  const usePersistentSearchCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  if (isPaginatedResult(store, usePersistentSearchCache)) {
    return loadPaginatedResultFromCache(usePersistentSearchCache, query)
  }
  return loadResultFromCache(usePersistentSearchCache, query)
}

function isPaginatedResult(store: Store, usePersistentCache: boolean) {
  const queryFrom = store.getState().query.products?.from || 0
  return usePersistentCache && queryFrom > 0
}

export function getCacheKey(query: SearchQuery): Omit<SearchQuery, "time"> {
  return {
    accountId: query.accountId,
    customRules: query.customRules,
    explain: query.explain,
    keywords: query.keywords,
    products: query.products,
    query: query.query,
    redirect: query.redirect,
    rules: query.rules,
    segments: query.segments,
    sessionParams: query.sessionParams
  }
}

// TODO: Better validation with valibot
export function isValueShapeCorrect(value: unknown): value is SearchResultDto {
  return typeof value === "object" && value !== null && "query" in value && "result" in value
}