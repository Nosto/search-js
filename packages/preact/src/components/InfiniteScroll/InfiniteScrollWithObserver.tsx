import { useLoadMore } from "@preact/hooks/useLoadMore/useLoadMore"
import { useNostoAppState } from "@preact/hooks/useNostoAppState"
import { isEqual } from "@utils/isEqual"
import { pick } from "@utils/pick"
import { JSX } from "preact"
import { memo } from "preact/compat"
import { useEffect, useRef } from "preact/hooks"

import { type InfiniteScrollProps } from "./InfiniteScroll"
import { hasMoreResults } from "./utils"

/**
 * Infinite scroll component that loads more results when user scrolls to the end of the page.
 * @group Components
 */
export const InfiniteScrollWithObserver = memo(
  ({ children, pageSize, observerOptions }: InfiniteScrollProps): JSX.Element => {
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
        }, observerOptions)

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
  },
  isEqual
)
