import { createPortal } from "preact/compat"
import { useRef } from "preact/hooks"
import { useRoute } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { styles } from "./CategoryInjected.styles"
import { CategoryContentInfinite } from "./components/CategoryContentInfinite"
import { CategoryContentPaginated } from "./components/CategoryContentPaginated"
import { CategoryQueryHandler } from "./components/CategoryQueryHandler"

export function CategoryInject() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { params } = useRoute()
  const { categoryPath } = params
  const categoryRef = useRef<HTMLDivElement>(null)

  return (
    <div className="category" title="Category (Injected)" style={styles.container}>
      <div id="inject-category" ref={categoryRef}>
        {categoryRef.current &&
          createPortal(
            <>
              <CategoryQueryHandler categoryPath={categoryPath} />
              {isInfiniteScrollEnabled ? <CategoryContentInfinite /> : <CategoryContentPaginated />}
            </>,
            categoryRef.current
          )}
      </div>
    </div>
  )
}
