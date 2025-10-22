import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { styles } from "./AutocompleteHistory.styles"
import { AutocompleteHistoryElement } from "./AutocompleteHistoryElement"

export function AutocompleteHistory() {
  const historyItems = useNostoAppState(state => state.historyItems)
  const highlightIndex = useNostoAppState(state => state.highlightIndex ?? -1)

  if (!historyItems) {
    return null
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Recent searches</div>
      {historyItems.map((item, index) => (
        <AutocompleteHistoryElement key={item} item={item} highlighted={index === highlightIndex} />
      ))}
    </div>
  )
}
