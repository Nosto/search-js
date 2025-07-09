import { CategoryConfig, CategoryPageProvider } from "@nosto/search-js/preact/category"

import { hitDecorators } from "../../utils/hitDecorators"
import { CategoryContentInfinite } from "./CategoryContentInfinite"
import { CategoryContentPaginated } from "./CategoryContentPaginated"

export function Category({ infinite = false }: { infinite?: boolean }) {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies CategoryConfig

  return (
    <CategoryPageProvider config={config}>
      {infinite ? <CategoryContentInfinite /> : <CategoryContentPaginated />}
    </CategoryPageProvider>
  )
}
