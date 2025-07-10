import { CategoryConfig, CategoryPageProvider } from "@nosto/search-js/preact/category"
import { useRoute } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { CategoryContentInfinite } from "./components/CategoryContentInfinite"
import { CategoryContentPaginated } from "./components/CategoryContentPaginated"
import { CategoryQueryHandler } from "./components/CategoryQueryHandler"

export function CategoryNative() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { params } = useRoute()
  const { categoryPath } = params

  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies CategoryConfig

  return (
    <div
      className="category"
      title="Category (Native)"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <CategoryPageProvider config={config}>
        <CategoryQueryHandler categoryPath={categoryPath} />
        {isInfiniteScrollEnabled ? <CategoryContentInfinite /> : <CategoryContentPaginated />}
      </CategoryPageProvider>
    </div>
  )
}
