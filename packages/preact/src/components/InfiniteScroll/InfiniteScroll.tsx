import { isBot } from "@utils/isBot"
import { ComponentChildren, ComponentType } from "preact"

import { InfiniteScrollWithLink } from "./InfiniteScrollWithLink"
import { InfiniteScrollWithObserver } from "./InfiniteScrollWithObserver"
import { intersectionObserverSupported } from "./utils"

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
  /**
   * The margin around the root element for the IntersectionObserver.
   * This can be used to trigger the loading of more results before the user reaches the end of the page.
   * @default "0px"
   * @example "500px 0px" - this will trigger loading more results when the user is 500px away from the end of the page.
   */
  rootMargin?: string
  /**
   * The root element for the IntersectionObserver.
   * If not provided, the observer will use the viewport as the root.
   */
  rootContiner?: Element
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
 *         <button
 *              onClick={loadMore}
 *          >
 *              More results
 *         </button>
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
  !isBot() && intersectionObserverSupported() ? InfiniteScrollWithObserver : InfiniteScrollWithLink
