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

export const createContextHandle = (
  context: AutocompleteInjectContext,
  element: AutocompleteDropdown | AutocompleteHistory
): AutocompleteUserContext => {
  const eventHandlers = createEventHandlers(context)
  return {
    reportProductClick: eventHandlers.onReportProductClick,
    reportKeywordClick: eventHandlers.onReportKeywordClick,
    handleSubmit: eventHandlers.onHandleSubmit,
    highlightedElementIndex: element.highlightedIndex()
  }
}

function createEventHandlers({ dropdown, history, store, input, onNavigateToSearch }: AutocompleteInjectContext) {
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
    onReportProductClick: (product: SearchProduct) => {
      onReportClick(product.name!, false)
    },
    onReportKeywordClick: (keyword: SearchKeyword) => {
      onReportClick(keyword.keyword, true)
    },
    onHandleSubmit: (query: SearchQuery) => {
      onReportClick(query.query!, false)
      onNavigateToSearch?.(query)
    }
  }
}
