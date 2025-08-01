import { SearchKeyword, SearchProduct } from "@nosto/nosto-js/client"
import { createContext } from "preact"

export const AutocompleteContext = createContext<{
  reportProductClick: (product: SearchProduct) => void
  reportKeywordClick: (keyword: SearchKeyword) => void
}>({
  reportProductClick: () => {},
  reportKeywordClick: () => {}
})
