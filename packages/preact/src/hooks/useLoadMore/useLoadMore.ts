import { SearchResult } from "@nosto/nosto-js/client"
import { updateSearch } from "@preact/actions/updateSearch"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { useCallback } from "preact/hooks"

import { useActionsContext } from "../useActionsContext"
import { getNextPageQuery } from "./getNextPageQuery"
import { mergePaginatedProductResultIfNeeded } from "./transformSearchResult"

/**
 * Hook for loading more results by specified pageSize value
 * @example
 * ```jsx
 *  import { useLoadMore } from '@nosto/search-js/preact'
 *
 *  function LoadMoreButton({ pageSize }) {
 *     const { loadMore } = useLoadMore(pageSize)
 *
 *     return (
 *         <a
 *              onClick={loadMore}
 *          >
 *              More results
 *         </a>
 *    )
 * }
 * ```
 * @param pageSize - number of additional products to load (default=24)
 * @group Hooks
 */
export function useLoadMore(pageSize = 24) {
  const { from, size, previousResult } = useNostoAppState(state => ({
    from: state.query.products?.from ?? 0,
    size: state.query.products?.size ?? 0,
    previousResult: state.response
  }))

  const context = useActionsContext()

  const loadMore = useCallback(async () => {
    await updateSearch({
      context,
      query: getNextPageQuery({ from, size, pageSize }),
      transformer: (newResult: SearchResult) => mergePaginatedProductResultIfNeeded({ newResult, previousResult })
    })
  }, [from, size, pageSize, previousResult, context])

  return {
    loadMore
  }
}
