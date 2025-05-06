import { nostojs } from "@nosto/nosto-js"
import { SearchQuery } from "@nosto/nosto-js/client"

import { applyDecorators } from "./applyDecorators"
import { DecoratedResult, HitDecorator, SearchFn, SearchOptions, SearchWithNext } from "./types"
import { searchWithCache } from "./withCache"
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
  const searchFn = wrap(api.search, searchWithRetries, searchWithCache, applyDecorators)
  return searchFn(query, options) as Promise<DecoratedResult<HD>>
}

function wrap<HD extends readonly HitDecorator[]>(inner: SearchFn<HD>, ...wrappers: SearchWithNext<HD>[]) {
  return wrappers.reduce<SearchFn<HD>>((inner, outer) => {
    return (query, options) => outer(query, options, inner)
  }, inner)
}
