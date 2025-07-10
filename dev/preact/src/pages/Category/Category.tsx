import { CategoryConfig, CategoryPageProvider } from "@nosto/search-js/preact/category"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { CategoryContentInfinite } from "./CategoryContentInfinite"
import { CategoryContentPaginated } from "./CategoryContentPaginated"
import { CategoryQueryHandler } from "./CategoryQueryHandler"

export function Category() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()

  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies CategoryConfig

  return (
    <div
      className="search"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <CategoryPageProvider config={config}>
        <CategoryQueryHandler />
        {isInfiniteScrollEnabled ? <CategoryContentInfinite /> : <CategoryContentPaginated />}
      </CategoryPageProvider>
    </div>
  )
}
