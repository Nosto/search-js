import { SearchKeyword, SearchProduct, SearchQuery } from "@nosto/nosto-js/client"
import { createContext } from "preact"

export type AutocompleteUserContext = {
  reportProductClick: (product: SearchProduct) => void
  reportKeywordClick: (keyword: SearchKeyword) => void
  handleSubmit: (query: SearchQuery) => void
  highlightedElementIndex: number
}

export const AutocompleteContext = createContext<AutocompleteUserContext>({
  reportProductClick: () => {},
  reportKeywordClick: () => {},
  handleSubmit: () => {},
  highlightedElementIndex: -1
})

// Note: createContextHandle function is intentionally not moved here
// as it depends on AutocompleteInjectContext which belongs to inject package
