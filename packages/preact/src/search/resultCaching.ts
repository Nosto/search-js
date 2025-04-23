import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"
import { mergeProductHits } from "@preact/hooks/useLoadMore/transformSearchResult"
import { isEqual } from "@utils/isEqual"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

export type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

const pageQueryFields = ["size", "from"]

export function cacheSearchResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const dto: SearchResultDto = { query, result }

  if (isPaginatedResult(query)) {
    const storageValue = getSessionStorageItem<SearchResultDto>(STORAGE_ENTRY_NAME)
    const newQuery = convertToSimpleQuery(query)

    if (!storageValue) {
      setSessionStorageItem(STORAGE_ENTRY_NAME, { query: newQuery, result })
      return
    }

    const cachedKey = getCacheKey(storageValue.query)
    if (isEqual(getCacheKey(newQuery), cachedKey, pageQueryFields)) {
      const merged = mergeProductHits(storageValue.result, result)
      setSessionStorageItem(STORAGE_ENTRY_NAME, { query: newQuery, result: merged })
      return
    }
  }

  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

export function loadCachedResultIfApplicable(usePersistentCache: boolean, query: SearchQuery) {
  if (!usePersistentCache) {
    return null
  }

  const storageValue = getSessionStorageItem(STORAGE_ENTRY_NAME)
  if (!storageValue || !isValueShapeCorrect(storageValue)) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  const newQuery = isPaginatedResult(query) ? convertToSimpleQuery(query) : query
  if (!isEqual(getCacheKey(newQuery), cachedQuery)) {
    return null
  }
  return storageValue.result
}

function isPaginatedResult(query: SearchQuery) {
  const queryFrom = query.products?.from || 0
  return queryFrom > 0
}

function convertToSimpleQuery(query: SearchQuery): SearchQuery {
  return {
    ...query,
    products: {
      ...query.products,
      size: (query.products?.from || 0) + (query.products?.size || 0),
      from: 0
    }
  }
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