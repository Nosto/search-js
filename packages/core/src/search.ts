import { nostojs } from "@nosto/nosto-js"
import { SearchQuery } from "@nosto/nosto-js/client"

import { applyDecorators } from "./applyDecorators"
import { DecoratedResult, HitDecorator, SearchFn, SearchOptions, SearchWithNext } from "./types"
import { searchWithCache } from "./withCache"
import { searchWithMemoryCache } from "./withMemoryCache"
import { searchWithRedirects } from "./withRedirects"
import { searchWithRetries } from "./withRetries"

/**
 * Performs a search operation using the provided query and options.
 *
 * @param query - The search query to be executed.
 * @param options - An object containing optional parameters for the search.
 * @returns A promise that resolves to the search result.
 *
 * @example
 * ```ts
 * import { search } from '@nosto/search-js'
 * import { priceDecorator } from '@nosto/search-js/currencies'
 *
 * // Basic search
 * const results = await search({ query: 'shoes' })
 *
 * // Search with decorators
 * const decoratedResults = await search(
 *   { query: 'shoes' },
 *   { hitDecorators: [priceDecorator()] }
 * )
 * ```
 *
 * @example
 * ```ts
 * import { search } from '@nosto/search-js'
 *
 * // Search with filters
 * const results = await search({
 *   query: 'shoes',
 *   filters: {
 *     color: ['red', 'blue']
 *   }
 * })
 * ```
 */
export async function search<HD extends readonly HitDecorator[]>(query: SearchQuery, options: SearchOptions<HD> = {}) {
  const api = await new Promise(nostojs)
  const searchFn = wrap(
    api.search,
    searchWithRetries,
    searchWithRedirects,
    searchWithMemoryCache,
    searchWithCache,
    applyDecorators
  )
  return searchFn(query, options) as Promise<DecoratedResult<HD>>
}

function wrap(inner: SearchFn, ...wrappers: SearchWithNext[]) {
  return wrappers.reduce<SearchFn>((inner, outer) => {
    return (query, options) => outer(query, options, inner)
  }, inner)
}
