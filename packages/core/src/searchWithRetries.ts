import type { API, SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { logger } from "@utils/logger"

import { SearchOptions } from "./types"
import { delay } from "./utils/delay"

export async function searchWithRetries(
  api: API,
  query: SearchQuery,
  options: SearchOptions<[]>
): Promise<SearchResult> {
  const { maxRetries = 0, retryInterval = 1000 } = options
  let retries = 0

  while (true) {
    try {
      const result = await api.search(query, options)
      return result
    } catch (error) {
      if (!shouldRetry(error)) {
        logger.info("Skipping retry logic for", error)
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
