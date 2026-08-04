import { search } from "@core/search"
import { SearchOptions } from "@core/types"
import type { SearchQuery, SearchTrackOptions } from "@nosto/nosto-js/client"
import { deepMerge } from "@utils/deepMerge"
import { logger } from "@utils/logger"
import { mergeArrays } from "@utils/mergeArrays"
import { measure } from "@utils/performance"

import { ActionContext } from "../types"
import { withDefaultQuery } from "./withDefaultQuery"

export type NewSearchOptions = Omit<SearchOptions, "track"> & {
  /**
   * The search type override for tracking. Use `false` to suppress tracking.
   */
  track?: SearchTrackOptions | false
}

export async function newSearch(context: ActionContext, query: SearchQuery, options?: NewSearchOptions): Promise<void> {
  const end = measure("newSearch")

  const pageType = context.config.pageType
  const defaultTrack = pageType === "search" ? "serp" : pageType
  const track = options?.track === false ? undefined : (options?.track ?? defaultTrack)

  const mergedQuery = deepMerge(context.store.getInitialState().query, query)
  const mergedOptions = deepMerge(context.config.search, options, {
    track,
    redirect: pageType !== "autocomplete",
    isKeyword: !!options?.isKeyword,
    usePersistentCache: context.config.pageType !== "autocomplete" && context.config.persistentSearchCache,
    useMemoryCache: context.config.pageType === "autocomplete" && context.config.memoryCache
  } satisfies SearchOptions)

  context.config.onBeforeSearch?.(context, mergedOptions)

  context.store.updateState({
    query: mergedQuery,
    loading: true,
    initialized: true
  })

  const fullQuery = context.config.queryModifications(
    {
      ...mergedQuery,
      products: {
        ...mergedQuery.products,
        // Apply filter merging to avoid overwriting base filters
        filter: mergeArrays(context.store.getInitialState().query?.products?.filter, query.products?.filter)
      }
    },
    pageType
  )

  try {
    const response = await search(withDefaultQuery(context.config.pageType, fullQuery), mergedOptions)

    context.store.updateState({
      response,
      loading: false
    })
  } catch (error) {
    logger.error("Search action failed", error)
    context.config.onSearchError?.(error, fullQuery, mergedOptions, pageType)
  }
  end()
}
