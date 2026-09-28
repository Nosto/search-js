import { nostojs } from "@nosto/nosto-js"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { isEqual } from "@utils/isEqual"

import { SearchFn, SearchOptions } from "./types"

type CacheEntry = {
  query: SearchQuery
  result: SearchResult
}

// Only the last query is remembered
let lastEntry: CacheEntry | undefined

export async function searchWithAppend(
  query: SearchQuery,
  options: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  try {
    return await searchOrAppend(query, options, searchFn)
  } catch (error) {
    lastEntry = undefined
    throw error
  }
}

async function searchOrAppend(query: SearchQuery, options: SearchOptions, searchFn: SearchFn): Promise<SearchResult> {
  if (!lastEntry?.result.products || !canAppend(lastEntry.query, query)) {
    const result = await searchFn(query, options)
    lastEntry = { query, result }
    return result
  }

  const cachedResult = lastEntry.result
  const from = query.products?.from ?? 0
  const size = query.products?.size ?? 0
  const cachedSize = lastEntry.query.products?.size ?? 0

  // Tracking is dropped from the tail request and recorded once for the combined result
  const { track, ...tailOptions } = options

  // Request only the products that are not in the cached result yet
  const tailQuery = {
    ...query,
    products: {
      ...query.products,
      from: from + cachedSize,
      size: size - cachedSize
    }
  }
  const tailResult = await searchFn(tailQuery, tailOptions)

  const cachedHits = cachedResult.products?.hits ?? []
  const tailHits = tailResult.products?.hits ?? []
  const result = {
    ...tailResult,
    products: {
      ...tailResult.products,
      total: tailResult.products?.total ?? 0,
      from,
      size,
      hits: [...cachedHits, ...tailHits]
    }
  }

  lastEntry = { query, result }
  if (track) {
    nostojs(api => api.recordSearch(track, query, result))
  }
  return result
}

/**
 * The new query can be appended to the cached one when it only differs in a larger `size`
 */
function canAppend(cachedQuery: SearchQuery, query: SearchQuery) {
  const cachedSize = cachedQuery.products?.size ?? 0
  const size = query.products?.size ?? 0
  if (size <= cachedSize) {
    return false
  }
  return isEqual(withoutSize(cachedQuery), withoutSize(query))
}

function withoutSize(query: SearchQuery) {
  return {
    ...query,
    products: { ...query.products, size: undefined }
  }
}

export function clearAppendCache() {
  lastEntry = undefined
}
