import { CategoryConfig, CategoryPageProvider } from "@nosto/search-js/preact/category"
import { createPortal } from "preact/compat"
import { useEffect, useState } from "preact/hooks"
import { useRoute } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { styles } from "./CategoryInjected.styles"
import { CategoryContentInfinite } from "./components/CategoryContentInfinite"
import { CategoryContentPaginated } from "./components/CategoryContentPaginated"
import { CategoryQueryHandler } from "./components/CategoryQueryHandler"

export function CategoryInject() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { params } = useRoute()
  const { categoryPath } = params
  const [categoryContainer, setCategoryContainer] = useState<Element | null>(null)

  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies CategoryConfig

  // Initialize category container
  useEffect(() => {
    const container = document.getElementById("inject-category")
    if (container) {
      setCategoryContainer(container)
    }
  }, [])

  return (
    <div className="category" title="Category (Injected)" style={styles.container}>
      <div id="inject-category" />

      {/* Render category content via portal into the category container */}
      {categoryContainer &&
        createPortal(
          <CategoryPageProvider config={config}>
            <CategoryQueryHandler categoryPath={categoryPath} />
            {isInfiniteScrollEnabled ? <CategoryContentInfinite /> : <CategoryContentPaginated />}
          </CategoryPageProvider>,
          categoryContainer
        )}
    </div>
  )
}
