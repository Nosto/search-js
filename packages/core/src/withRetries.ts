import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { logger } from "@utils/logger"

import { SearchFn, SearchOptions } from "./types"
import { delay } from "./utils/delay"

export async function searchWithRetries(
  query: SearchQuery,
  { maxRetries = 0, retryInterval = 0, ...options }: SearchOptions,
  searchFn: SearchFn
): Promise<SearchResult> {
  let retries = 0

  while (true) {
    try {
      return await searchFn(query, options)
    } catch (error) {
      if (retries >= maxRetries) {
        throw error
      }
      if (!shouldRetry(error)) {
        logger.info("Skipping retry logic for", error)
        throw error
      }

      retries++
      await delay(retryInterval)
    }
  }
}

/**
 * Should the error trigger a search retry
 */
export function shouldRetry(error: unknown): error is object {
  if (!error || typeof error !== "object") {
    return false
  }

  return !("status" in error) || isValidStatus(error.status)
}

function isValidStatus(status: unknown) {
  return typeof status === "number" && (status < 400 || status >= 500)
}
