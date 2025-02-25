import { nostojs } from "@nosto/nosto-js"
import { SearchQuery } from "@nosto/nosto-js/client"

import { applyDecorators } from "./applyDecorators"
import { searchWithRetries } from "./searchWithRetries"
import { HitDecorator, Options } from "./types"

/**
 * Performs a search operation using the provided query and options.
 *
 * @param query - The search query to be executed.
 * @param options - An object containing optional parameters for the search.
 * @returns A promise that resolves to the search result.
 */
export async function search<HD extends HitDecorator[]>(query: SearchQuery, options: Options<HD> = {}) {
  const { hitDecorators, ...rest } = options
  const api = await new Promise(nostojs)
  const searchResult = await searchWithRetries(api, query, rest)
  return applyDecorators(searchResult, hitDecorators)
}
