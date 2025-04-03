import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { pick } from "@utils/pick"

import { type InfiniteScrollProps } from "./InfiniteScroll"
import { LoadMoreLink } from "./LoadMoreLink"
import { hasMoreResults } from "./utils"

/**
 * Infinite scroll component that loads more results when user clicks a link.
 * * @example
 * ```tsx
 * import { InfiniteScrollWithLink } from "@nosto/search-js/preact"
 *
 * // With custom load more button
 * function LoadMoreButton({ pageSize }) {
 *     const { loadMore } = useLoadMore(pageSize)
 *
 *     return (
 *         <button
 *              onClick={loadMore}
 *          >
 *              More results
 *         </button>
 *    )
 * }
 *
 * <InfiniteScrollWithLink loadMoreComponent={LoadMoreButton} pageSize={defaultConfig.pageSize}>
 *   {products?.hits?.map(hit => <Product hit={hit} />)}
 * </InfiniteScrollWithLink>
 * ```
 * @group Components
 */
export function InfiniteScrollWithLink({ children, loadMoreComponent: LoadMore, pageSize }: InfiniteScrollProps) {
  const { loading, query, response } = useNostoAppState(state => pick(state, "loading", "query", "response"))
  const renderLoadMore = !loading && hasMoreResults(query, response)

  return (
    <>
      {children}
      {renderLoadMore && (LoadMore ? <LoadMore pageSize={pageSize} /> : <LoadMoreLink pageSize={pageSize} />)}
    </>
  )
}
