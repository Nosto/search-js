import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { useCallback } from "preact/hooks"
import { getNextPageQuery } from "./getNextPageQuery"
import { useActions } from "../useActions"

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
    await updateSearch(getNextPageQuery({ from, size, pageSize }))
  }, [from, size, pageSize, previousResult])

  return {
    loadMore
  }
}
