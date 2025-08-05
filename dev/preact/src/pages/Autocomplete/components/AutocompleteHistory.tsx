import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { AutocompleteHistoryElement } from "./AutocompleteHistoryElement"

const styles = {
  container: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 1000,
    maxHeight: "400px",
    overflow: "auto",
    marginTop: "4px"
  },
  header: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    lineHeight: 1,
    padding: "8px 16px"
  }
}

export function AutocompleteHistory() {
  const historyItems = useNostoAppState(state => state.historyItems)

  if (!historyItems) {
    return null
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>Recent searches</div>
      {historyItems.map(item => (
        <AutocompleteHistoryElement key={item} item={item} />
      ))}
    </div>
  )
}
