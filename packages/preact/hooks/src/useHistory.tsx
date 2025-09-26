import { useAutocompleteConfig } from "@preact/common/config/configContext"
import { StoreContext } from "@preact/common/store/storeContext"
import { getLocalStorageItem, setLocalStorageItem } from "@utils/storage"
import { useCallback, useContext } from "preact/hooks"

const historyKey = "nosto:search-js:history"

export function useHistory() {
  const { updateState } = useContext(StoreContext)
  const { historySize } = useAutocompleteConfig()

  const addQuery = useCallback(
    (value: string) => {
      const allItems = getLocalStorageItem<string[]>(historyKey) ?? []
      const filteredItems = allItems.filter(v => v !== value).slice(historySize ? -historySize : 0)
      filteredItems.push(value)
      setLocalStorageItem(historyKey, filteredItems)
      updateState({ historyItems: filteredItems.reverse() })
    },
    [historySize, updateState]
  )

  const readSaved = useCallback(() => {
    const historyFromLocalStorage = getLocalStorageItem<string[]>(historyKey) ?? []
    return historyFromLocalStorage.reverse().filter((c: string) => !!c)
  }, [])

  return {
    addQuery,
    readSaved
  }
}
