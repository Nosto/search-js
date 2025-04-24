import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"
import { isPlainObject } from "@utils/isPlainObject"
import { getSessionStorageItem, setSessionStorageItem } from "@utils/storage"

export const STORAGE_ENTRY_NAME = "nosto:search:searchResult"

const pageQueryFields = ["size", "from"]

export type SearchResultDto = {
  query: ReturnType<typeof getCacheKey>
  result: SearchResult
}

export function loadCachedResultIfApplicable(usePersistentCache: boolean, query: SearchQuery) {
  if (!usePersistentCache) {
    return null
  }

  const storageValue = getSessionStorageItem<SearchResultDto>(STORAGE_ENTRY_NAME)
  if (!storageValue) {
    return null
  }

  const cachedQuery = getCacheKey(storageValue.query)
  if (!isEqual(getCacheKey(query), cachedQuery, pageQueryFields)) {
    return null
  }
  return storageValue
}

export function cacheSearchResult(usePersistentCache: boolean, query: SearchQuery, result: SearchResult) {
  if (!usePersistentCache) {
    return
  }

  const dto: SearchResultDto = { query, result }
  setSessionStorageItem(STORAGE_ENTRY_NAME, dto)
}

function getCacheKey<T extends object>(query: T): Omit<SearchQuery, "time"> {
  return Object.entries(query)
    .filter(([k, v]) => k !== "time" && v !== undefined)
    .reduce((acc, [key, value]) => {
      if (isPlainObject(value)) {
        return {
          ...acc,
          [key]: getCacheKey(value)
        }
      }

      if (Array.isArray(value)) {
        return {
          ...acc,
          [key]: value.map(v => (isPlainObject(v) ? getCacheKey(v) : v))
        }
      }

      return value !== undefined
        ? {
            ...acc,
            [key]: value
          }
        : acc
    }, {} as T)
}

// TODO: Better validation with valibot
export function isValueShapeCorrect(value: unknown): value is SearchResultDto {
  return typeof value === "object" && value !== null && "query" in value && "result" in value
}
