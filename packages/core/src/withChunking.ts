import { nostojs } from "@nosto/nosto-js"
import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { SearchFn, SearchOptions } from "./types"

/**
 * Maximum number of products the search API returns in a single request.
 */
export const MAX_CHUNK_SIZE = 250

export async function searchWithChunking(
  query: SearchQuery,
  options: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  const from = query.products?.from ?? 0
  const size = query.products?.size ?? 0
  if (size <= MAX_CHUNK_SIZE) {
    return searchFn(query, options)
  }

  // Tracking is dropped from the chunk requests and recorded once for the combined result
  const { track, ...chunkOptions } = options

  const results: SearchResult[] = []
  const chunkCount = Math.ceil(size / MAX_CHUNK_SIZE)
  for (let i = 0; i < chunkCount; i++) {
    const offset = i * MAX_CHUNK_SIZE
    const chunkStart = from + offset
    const chunkSize = Math.min(MAX_CHUNK_SIZE, size - offset)
    const chunkQuery = {
      ...query,
      products: { ...query.products, from: chunkStart, size: chunkSize }
    }

    const chunkResult = await searchFn(chunkQuery, chunkOptions)
    results.push(chunkResult)

    // No more products to fetch beyond the total
    const total = chunkResult.products?.total ?? 0
    if (chunkStart + chunkSize >= total) {
      break
    }
  }

  const result = combineResults(results, from, size)
  if (track) {
    nostojs(api => api.recordSearch(track, query, result))
  }
  return result
}

function combineResults(results: SearchResult[], from: number, size: number): SearchResult {
  const first = results[0]
  if (!first.products) {
    return first
  }

  const hits = []
  for (const result of results) {
    hits.push(...(result.products?.hits ?? []))
  }

  return {
    ...first,
    products: { ...first.products, from, size, hits }
  }
}
