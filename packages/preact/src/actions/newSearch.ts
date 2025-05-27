import { search } from "@core/search"
import { SearchOptions } from "@core/types"
import type { SearchQuery } from "@nosto/nosto-js/client"
import { applyQueryDefaults } from "@preact/search/defaults"
import { deepMerge } from "@utils/deepMerge"
import { logger } from "@utils/logger"
import { mergeArrays } from "@utils/mergeArrays"
import { measure } from "@utils/performance"

import { ActionContext } from "./types"

export async function newSearch(context: ActionContext, query: SearchQuery, options?: SearchOptions): Promise<void> {
  const end = measure("newSearch")

  const pageType = context.config.pageType
  const track = pageType === "search" ? "serp" : pageType

  const mergedQuery = deepMerge(context.store.getInitialState().query, query)
  const mergedOptions = deepMerge(context.config.search, options, {
    track,
    redirect: pageType !== "autocomplete",
    isKeyword: !!options?.isKeyword,
    usePersistentCache: context.config.pageType !== "autocomplete" && context.config.persistentSearchCache,
    enableMemoryCache: context.config.pageType === "autocomplete"
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
    const response = await search(applyQueryDefaults(context.config.pageType, fullQuery), mergedOptions)

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
