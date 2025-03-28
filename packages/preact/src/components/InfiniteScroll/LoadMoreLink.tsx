import { useLoadMore } from "@preact/hooks/useLoadMore/useLoadMore"

/**
 * Load more link component
 * @group Components
 */
export function LoadMoreLink({ pageSize }: { pageSize?: number }) {
  const { loadMore } = useLoadMore(pageSize)

  return <button onClick={loadMore}>More results</button>
}
