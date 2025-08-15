import { nostojs } from "@nosto/nosto-js"
import { SearchKeyword, SearchProduct, SearchQuery } from "@nosto/nosto-js/client"
import { createContext } from "preact"

import { AutocompleteInjectContext } from "../injectAutocomplete"
import { AutocompleteDropdown } from "./components/AutocompleteDropdown"
import { AutocompleteHistory } from "./components/AutocompleteHistory"

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

export function createContextHandle(
  context: AutocompleteInjectContext,
  element: AutocompleteDropdown | AutocompleteHistory
): AutocompleteUserContext {
  const { dropdown, history, store, input, onNavigateToSearch } = context
  const onReportClick = (query: string, isKeyword: boolean) => {
    dropdown.hide()
    history.hide()
    if (!query) {
      return
    }

    history.add(query)
    store.updateState({
      historyItems: history.get()
    })
    if (isKeyword) {
      nostojs(api => api.recordSearchSubmit(query))
    }
    input.value = query
  }

  return {
    reportProductClick: (product: SearchProduct) => {
      onReportClick(product.name!, false)
    },
    reportKeywordClick: (keyword: SearchKeyword) => {
      onReportClick(keyword.keyword, true)
    },
    handleSubmit: (query: SearchQuery) => {
      onReportClick(query.query!, false)
      onNavigateToSearch?.(query)
    },
    highlightedElementIndex: element.highlightedIndex()
  }
}
