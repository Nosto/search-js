import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

/**
 * Function to check if there are more results to fetch.
 */
export function hasMoreResults(query: SearchQuery, result: SearchResult) {
  const total = result.products?.total ?? 0
  const from = query.products?.from ?? 0
  const size = query.products?.size ?? 0
  return total > 0 && total > from + size
}

/**
 * Function to check if IntersectionObserver is supported in the browser.
 */
export function intersectionObserverSupported() {
  return !!(
    window.IntersectionObserver &&
    window.IntersectionObserverEntry &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype
  )
}
