import { init } from "@nosto/search-js/preact/inject"
import { useRoute } from "preact-iso"

import { useInfiniteScroll } from "../../contexts/InfiniteScrollContext"
import { hitDecorators } from "../../utils/hitDecorators"
import { useEffectOnce } from "../../utils/useEffectOnce"
import { CategoryContentInfinite } from "./components/CategoryContentInfinite"
import { CategoryContentPaginated } from "./components/CategoryContentPaginated"
import { CategoryQueryHandler } from "./components/CategoryQueryHandler"

export function CategoryInject() {
  const { isInfiniteScrollEnabled } = useInfiniteScroll()
  const { params } = useRoute()
  const { categoryPath } = params

  useEffectOnce(() => {
    init({
      category: {
        config: {
          defaultCurrency: "EUR",
          search: {
            hitDecorators
          }
        },
        cssSelector: "#inject-category",
        render: () => (
          <>
            <CategoryQueryHandler categoryPath={categoryPath} />
            {isInfiniteScrollEnabled ? <CategoryContentInfinite /> : <CategoryContentPaginated />}
          </>
        )
      }
    })
  })

  return (
    <div
      className="category"
      title="Category (Injected)"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <div id="inject-category" />
    </div>
  )
}
