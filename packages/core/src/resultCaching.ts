import { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

const CACHE_NAME = "nosto-search-cache"

const TTL = 60 * 1000 // 1 minute
const MAX_CACHE_SIZE = 20

type CacheEntry = {
  result: SearchResult
  created: number
}

function getRequestForQuery(query: SearchQuery) {
  const cacheKey = getCacheKey(query)
  return new Request(`https://${CACHE_NAME}/${encodeURIComponent(cacheKey)}`)
}

export async function cacheSearchResult(query: SearchQuery, result: SearchResult) {
  const cache = await caches.open(CACHE_NAME)
  const requests = await cache.keys()
  if (requests.length > MAX_CACHE_SIZE) {
    // Remove the oldest entry (FIFO)
    await cache.delete(requests[0])
  }
  const request = getRequestForQuery(query)
  const response = new Response(JSON.stringify({ result, created: Date.now() }), {
    headers: { "Content-Type": "application/json" }
  })
  await cache.put(request, response)
}

export async function loadCachedResult(query: SearchQuery) {
  const cache = await caches.open(CACHE_NAME)
  const request = getRequestForQuery(query)
  const response = await cache.match(request)
  if (!response) {
    return null
  }
  const storageValue = (await response.json()) as CacheEntry
  if (Date.now() - storageValue.created > TTL) {
    return null
  }
  return storageValue.result
}

// This function is used to create a cache key for the search query.
// It removes the time and size properties from the query object.
function getCacheKey(query: SearchQuery) {
  const params = {
    ...query,
    time: undefined,
    products: {
      ...query.products,
      size: undefined
    }
  }
  return JSON.stringify(params)
}
