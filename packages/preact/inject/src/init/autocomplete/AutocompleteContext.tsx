import { SearchKeyword, SearchProduct, SearchQuery } from "@nosto/nosto-js/client"
import { createContext } from "preact"

export const AutocompleteContext = createContext<{
  reportProductClick: (product: SearchProduct) => void
  reportKeywordClick: (keyword: SearchKeyword) => void
  handleSubmit: (query: SearchQuery) => void
}>({
  reportProductClick: () => {},
  reportKeywordClick: () => {},
  handleSubmit: () => {}
})
