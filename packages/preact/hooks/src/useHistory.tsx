import { useAutocompleteConfig } from "@preact/common/config/configContext"
import { Store } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { getLocalStorageItem, setLocalStorageItem } from "@utils/storage"
import { useCallback, useContext } from "preact/hooks"

export const historyKey = "nosto:search-js:history"

type HistoryEntry = {
  value: string
  store: Store
  historySize: number
}

export function addToHistory({ value, historySize, store }: HistoryEntry) {
  const allItems = getLocalStorageItem<string[]>(historyKey) ?? []
  const currentElements = allItems.filter(v => v !== value).concat(value)
  const sliceToSave = historySize ? currentElements.slice(-historySize) : []
  setLocalStorageItem(historyKey, sliceToSave)
  store.updateState({ historyItems: sliceToSave.reverse() })
}

export function getSavedHistory() {
  const historyFromLocalStorage = getLocalStorageItem<string[]>(historyKey) ?? []
  return historyFromLocalStorage
    .slice()
    .reverse()
    .filter((c: string) => !!c)
}

export function useHistory() {
  const store = useContext(StoreContext)
  const { historySize } = useAutocompleteConfig()

  const addQuery = useCallback(
    (value: string) => {
      addToHistory({ value, historySize, store })
    },
    [historySize, store]
  )

  return {
    addQuery
  }
}
