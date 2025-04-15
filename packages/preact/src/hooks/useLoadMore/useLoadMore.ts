import { SearchResult } from "@nosto/nosto-js/client"
import { useActions } from "@preact/hooks/useActions"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { useCallback } from "preact/hooks"

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
  const { updateSearch } = useActions()

  const loadMore = useCallback(async () => {
    await updateSearch(getNextPageQuery({ from, size, pageSize }), undefined, (newResult: SearchResult) =>
      mergePaginatedProductResultIfNeeded({ newResult, previousResult })
    )
  }, [from, size, pageSize, updateSearch, previousResult])

  return {
    loadMore
  }
}
