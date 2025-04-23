import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { ActionContext } from "@preact/actions/types"
import { Store } from "@preact/store"

import { cachePaginatedResult, loadPaginatedResultFromCache } from "./pagedCaching"
import { cacheResult, loadResultFromCache } from "./simpleCaching"

export function cacheSearchResult({ config, store }: ActionContext, query: SearchQuery, result: SearchResult) {
  const usePersistentSearchCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  if (isInfiniteScroll(store, usePersistentSearchCache)) {
    cachePaginatedResult(usePersistentSearchCache, query, result)
  } else {
    cacheResult(usePersistentSearchCache, query, result)
  }
}

export function loadCachedResultIfApplicable({ config, store }: ActionContext, query: SearchQuery) {
  const usePersistentSearchCache = config.pageType !== "autocomplete" && config.persistentSearchCache

  if (isInfiniteScroll(store, usePersistentSearchCache)) {
    return loadPaginatedResultFromCache(usePersistentSearchCache, query)
  }
  return loadResultFromCache(usePersistentSearchCache, query)
}

function isInfiniteScroll(store: Store, usePersistentCache: boolean) {
  const queryFrom = store.getState().query.products?.from || 0
  return usePersistentCache && queryFrom > 0
}
