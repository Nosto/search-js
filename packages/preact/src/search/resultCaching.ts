import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

export function cacheSearchResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const dto: SearchResultDto = { query, result }
  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

export function loadCachedResultIfApplicable(usePersistentCache: boolean, query: SearchQuery): SearchResult | null {
  if (!usePersistentCache) {
    return null
  }

  const storageValue = getSessionStorageItem(STORAGE_ENTRY_NAME)
  if (!storageValue || !isValueShapeCorrect(storageValue)) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
    return null
  }
  return storageValue.result
}

function getCacheKey(query: SearchQuery): Omit<SearchQuery, "time"> {
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
function isValueShapeCorrect(value: unknown): value is SearchResultDto {
  return typeof value === "object" && value !== null && "query" in value && "result" in value
}
