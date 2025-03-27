import { isBot } from "@utils/isBot"
import { useCallback } from "preact/hooks"

import { useActions } from "./useActions"
import { useNostoAppState } from "./useNostoAppState"

function queryChanges({ from, size, pageSize }: { from: number; size: number; pageSize: number }) {
  if (isBot()) {
    // increase from value for bots to move to the next page instead of loading more products
    return {
      products: { from: from + pageSize }
    }
  }
  return {
    products: { size: size + pageSize }
  }
}

/**
 * Hook for loading more results by specified pageSize value
 * @example
 * ```jsx
 *  function LoadMoreButton({ pageSize }) {
 *     const { loadMore, href } = useLoadMore(pageSize)
 *
 *     return (
 *         <a
 *              onClick={loadMore}
 *              href={href}
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

  const loadMore = useCallback(
    async (e?: MouseEvent) => {
      e?.preventDefault()
      await updateSearch(queryChanges({ from, size, pageSize }))
    },
    [from, size, pageSize, updateSearch]
  )

  return {
    loadMore
  }
}
