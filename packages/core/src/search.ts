import { nostojs } from "@nosto/nosto-js"
import { SearchQuery } from "@nosto/nosto-js/client"

import { applyDecorators } from "./applyDecorators"
import { DecoratedResult, HitDecorator, SearchFn, SearchOptions, SearchWithNext } from "./types"
import { searchWithCache } from "./withCache"
import { autocompleteWithMemoryCache } from "./withMemoryCache"
import { searchWithRetries } from "./withRetries"

/**
 * Performs a search operation using the provided query and options.
 *
 * @param query - The search query to be executed.
 * @param options - An object containing optional parameters for the search.
 * @returns A promise that resolves to the search result.
 */
export async function search<HD extends readonly HitDecorator[]>(query: SearchQuery, options: SearchOptions<HD> = {}) {
  const api = await new Promise(nostojs)
  const searchFn = wrap(api.search, searchWithRetries, autocompleteWithMemoryCache, searchWithCache, applyDecorators)
  return searchFn(query, options) as Promise<DecoratedResult<HD>>
}

function wrap(inner: SearchFn, ...wrappers: SearchWithNext[]) {
  return wrappers.reduce<SearchFn>((inner, outer) => {
    return (query, options) => outer(query, options, inner)
  }, inner)
}
