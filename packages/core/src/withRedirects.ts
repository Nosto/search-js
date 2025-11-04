import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"

import { SearchFn, SearchOptions } from "./types"

/**
 * Checks if a search query matches a keyword with a redirect URL.
 *
 * @param query - The search query string
 * @param result - The search result containing keywords
 * @returns The redirect URL if a matching keyword with redirect is found, otherwise undefined
 *
 * @example
 * ```ts
 * import { search, getRedirectUrl } from '@nosto/search-js'
 *
 * const result = await search({ query: 'sale' })
 * const redirectUrl = getRedirectUrl('sale', result)
 * if (redirectUrl) {
 *   window.location.href = redirectUrl
 * }
 * ```
 */
export function getRedirectUrl(query: string | undefined, result: SearchResult): string | undefined {
  if (!query) {
    return undefined
  }

  const queryString = query.toLowerCase().trim()
  if (!queryString || !result.keywords?.hits) {
    return undefined
  }

  const matchingKeyword = result.keywords.hits.find(
    keyword => keyword.keyword.toLowerCase().trim() === queryString && keyword._redirect
  )

  return matchingKeyword?._redirect
}

/**
 * Search middleware for redirect support.
 *
 * This is a pass-through middleware that exists to maintain consistency with the middleware
 * naming convention. The actual redirect logic is implemented via the `getRedirectUrl` helper
 * function, which should be called in autocomplete components to check for keyword redirects
 * before navigation.
 *
 * Note: Redirects cannot be performed during the search operation itself as that would
 * break normal search flows. Instead, redirects are handled at the UI layer using `getRedirectUrl`.
 *
 * @param query - The search query
 * @param options - Search options
 * @param searchFn - The next search function in the middleware chain
 * @returns The search result
 * @internal
 */
export async function searchWithRedirects(
  query: SearchQuery,
  options: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  return searchFn(query, options)
}
