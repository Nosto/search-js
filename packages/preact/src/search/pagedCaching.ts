import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { mergeProductHits } from "@preact/hooks/useLoadMore/transformSearchResult"
import { isEqual, isEqualIgnoringFields } from "@utils/isEqual"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search:paged:searchResult"

type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

const pageQueryFields = ["size", "from"]

export function cachePaginatedResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const storageValues = getSessionStorageItem<SearchResultDto[]>(STORAGE_ENTRY_NAME)
  if (!storageValues || !storageValues.every(isValueShapeCorrect)) {
    return null
  }

  const recentValue = storageValues[storageValues.length - 1]

  const linked = isEqualIgnoringFields(getCacheKey(query), getCacheKey(recentValue.query), pageQueryFields)

  if (!linked) {
    setSessionStorageItem(STORAGE_ENTRY_NAME, [{ query, result }])
  } else {
    storageValues.push({ query, result })
    setSessionStorageItem(STORAGE_ENTRY_NAME, storageValues)
  }
}

export function loadPaginatedResultFromCache(usePersistentCache: boolean, query: SearchQuery): SearchResult | null {
  if (!usePersistentCache) {
    return null
  }

  const storageValues = getSessionStorageItem<SearchResultDto[]>(STORAGE_ENTRY_NAME)
  if (!storageValues || !storageValues.every(isValueShapeCorrect)) {
    return null
  }

  const recentValue = storageValues[storageValues.length - 1]

  const cachedQuery = getCacheKey(recentValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery)) {
    return null
  }
  return mergeProductHits(...storageValues.map(item => item.result))
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
