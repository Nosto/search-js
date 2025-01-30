import { nostojs } from "@nosto/nosto-js"
import { API, SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { HitDecorator, Options } from "./types"
import { applyDecorators } from "./decorators/applyDecorators"
import { shouldRetry } from "./utils/shouldRetry"
import { delay } from "./utils/delay"

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

async function searchWithRetries(api: API, query: SearchQuery, options: Options<[]>): Promise<SearchResult> {
  const { maxRetries = 0, retryInterval = 1000 } = options
  let retries = 0

  while (true) {
    try {
      const result = await api.search(query, options)
      return result
    } catch (error) {
      if (!shouldRetry(error)) {
        console.info("Skipping retry logic for", error)
        throw error
      }

      if (retries >= maxRetries) {
        throw error
      }

      retries++
      await delay(retryInterval)
    }
  }
}
