import { useAutocompleteConfig } from "@preact/common/config/configContext"
import { StoreContext } from "@preact/common/store/storeContext"
import { getLocalStorageItem, setLocalStorageItem } from "@utils/storage"
import { useCallback, useContext } from "preact/hooks"

export const historyKey = "nosto:search-js:history"

export function useHistory() {
  const { updateState } = useContext(StoreContext)
  const { historySize } = useAutocompleteConfig()

  const addQuery = useCallback(
    (value: string) => {
      const allItems = getLocalStorageItem<string[]>(historyKey) ?? []
      const currentElements = allItems.filter(v => v !== value).concat(value)
      const sliceToSave = historySize ? currentElements.slice(-historySize) : []
      setLocalStorageItem(historyKey, sliceToSave)
      updateState({ historyItems: sliceToSave.reverse() })
    },
    [historySize, updateState]
  )

  const getSaved = useCallback(() => {
    const historyFromLocalStorage = getLocalStorageItem<string[]>(historyKey) ?? []
    return historyFromLocalStorage
      .slice()
      .reverse()
      .filter((c: string) => !!c)
  }, [])

  return {
    addQuery,
    getSaved
  }
}
