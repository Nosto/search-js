import { useLoadMore } from "@preact/hooks/useLoadMore/useLoadMore"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { isEqual } from "@utils/isEqual"
import { pick } from "@utils/pick"
import { memo } from "preact/compat"
import { useEffect, useMemo, useRef } from "preact/hooks"

import { type InfiniteScrollProps } from "./InfiniteScroll"
import { hasMoreResults } from "./utils"

function BaseInfiniteScrollWithObserver({ children, pageSize, observerOptions }: InfiniteScrollProps) {
  const endResultsRef = useRef<HTMLDivElement>(null)
  const { query, response } = useNostoAppState(state => pick(state, "query", "response"))

  const { loadMore } = useLoadMore(pageSize)

  const lastSeenObserverOptions = useRef<IntersectionObserverInit | undefined>()
  const safeObserverOptions = useMemo(() => {
    if (!isEqual(observerOptions, lastSeenObserverOptions.current)) {
      lastSeenObserverOptions.current = observerOptions
    }
    return lastSeenObserverOptions.current
  }, [observerOptions])

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
      }, safeObserverOptions)

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
  }, [response, safeObserverOptions])

  return (
    <>
      {children}
      {/* Inlining height style for Safari support, so the IntersectionObserver sees the element. */}
      <div ref={endResultsRef} style={{ height: "1px" }} />
    </>
  )
}

/**
 * Infinite scroll component that loads more results when user scrolls to the end of the page.
 * @group Components
 */
export const InfiniteScrollWithObserver = memo(BaseInfiniteScrollWithObserver, isEqual)
