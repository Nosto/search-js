import type { SearchQuery, SearchResult } from "@nosto/nosto-js/client"
import { useLoadMore } from "@preact/hooks/useLoadMore/useLoadMore"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { isBot } from "@utils/isBot"
import { pick } from "@utils/pick"
import { ComponentChildren, ComponentType, JSX } from "preact"
import { useEffect, useRef } from "preact/hooks"

const intersectionObserverSupported =
  window.IntersectionObserver &&
  window.IntersectionObserverEntry &&
  "intersectionRatio" in window.IntersectionObserverEntry.prototype

function hasMoreResults(query: SearchQuery, result: SearchResult) {
  const total = result.products?.total ?? 0
  const from = query.products?.from ?? 0
  const size = query.products?.size ?? 0
  return total > 0 && total > from + size
}

/**
 * Infinite scroll component that loads more results when user scrolls to the end of the page.
 * If the browser does not support IntersectionObserver, a load more button is shown instead.
 * @param props
 * @example
 * ```jsx
 * import { InfiniteScroll } from "@nosto/search-js/preact"
 *
 * <InfiniteScroll pageSize={defaultConfig.pageSize}>
 *    {products?.hits?.map(hit => <Product hit={hit} />)}
 * </InfiniteScroll>
 *
 * <InfiniteScroll pageSize={defaultConfig.pageSize}>
 *    <Products />
 * </InfiniteScroll>
 *
 * // With custom load more button
 * function LoadMoreButton({ pageSize }) {
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
 *
 * <InfiniteScroll loadMoreComponent={LoadMoreButton} pageSize={defaultConfig.pageSize}>
 *   {products?.hits?.map(hit => <Product hit={hit} />)}
 * </InfiniteScroll>
 * ```
 * @group Components
 */
export const InfiniteScroll =
  !isBot() && intersectionObserverSupported ? InfiniteScrollWithObserver : InfiniteScrollWithLink

/**
 * Infinite scroll component props
 * @param children - The children to render
 * @param loadMoreComponent - The component to render when more results are available
 * @param pageSize - The page size to use when loading more results
 */
export interface InfiniteScrollProps {
  children: ComponentChildren
  loadMoreComponent?: ComponentType<{ pageSize?: number }>
  pageSize?: number
}

function InfiniteScrollWithObserver({ children, pageSize }: InfiniteScrollProps): JSX.Element {
  const endResultsRef = useRef<HTMLDivElement>(null)
  const { query, response } = useNostoAppState(state => pick(state, "query", "response"))

  const { loadMore } = useLoadMore(pageSize)

  useEffect(() => {
    let loader: HTMLDivElement | null
    let observer: IntersectionObserver

    if (hasMoreResults(query, response)) {
      loader = endResultsRef.current
      observer = new IntersectionObserver(entries => {
        const target = entries[0]
        if (target?.isIntersecting) {
          loadMore()
        }
      })

      if (loader) {
        observer.observe(loader)
      }
    }

    return () => {
      if (loader) {
        observer.unobserve(loader)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  return (
    <>
      {children}
      {/* Inlining height style for Safari support, so the IntersectionObserver sees the element. */}
      <div ref={endResultsRef} style={{ height: "1px" }} />
    </>
  )
}

/**
 * Infinite scroll component that loads more results when user clicks a link.
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

function LoadMoreLink({ pageSize }: { pageSize?: number }) {
  const { loadMore } = useLoadMore(pageSize)

  return (
    <a onClick={loadMore} href="#">
      More results
    </a>
  )
}
