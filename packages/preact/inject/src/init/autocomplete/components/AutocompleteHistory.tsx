import { CssSelector } from "@preact/inject/resolveCssSelector"
import { getLocalStorageItem, setLocalStorageItem } from "@utils/storage"

import { createComponent } from "./createComponent"

const historyKey = "nosto:search-js:history"

export type AutocompleteHistory = ReturnType<typeof createHistoryComponent>

export function createHistoryComponent(input: HTMLInputElement, dropdownSelector: CssSelector, historySize: number) {
  const dropdown = document.createElement("div")
  dropdown.className = "nosto-autocomplete-history"
  const base = createComponent(input, dropdown, dropdownSelector)

  return {
    ...base,
    element: dropdown,
    add: (value: string) => {
      const allItems = getLocalStorageItem<string[]>(historyKey) ?? []
      const filteredItems = allItems.filter(v => v !== value).slice(historySize ? -historySize : 0)
      filteredItems.push(value)
      setLocalStorageItem(historyKey, filteredItems)
    },
    get: () => {
      const historyFromLocalStorage = getLocalStorageItem<string[]>(historyKey) || []
      const historyItems = historyFromLocalStorage
        ? historyFromLocalStorage.reverse().filter((c: string) => !!c)
        : undefined

      return historyItems
    }
  }
}
