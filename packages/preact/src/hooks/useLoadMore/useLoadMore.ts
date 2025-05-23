import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { useCallback } from "preact/hooks"

import { useActions } from "../useActions"
import { getNextPageQuery } from "./getNextPageQuery"

/**
 * Hook for loading more results by specified pageSize value
 * @example
 * ```jsx
 *  import { useLoadMore } from '@nosto/search-js/preact/hooks'
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
  const { from, size } = useNostoAppState(state => ({
    from: state.query.products?.from ?? 0,
    size: state.query.products?.size ?? 0
  }))
  const { updateSearch } = useActions()

  const loadMore = useCallback(async () => {
    await updateSearch(getNextPageQuery({ from, size, pageSize }))
  }, [from, size, pageSize, updateSearch])

  return {
    loadMore
  }
}
