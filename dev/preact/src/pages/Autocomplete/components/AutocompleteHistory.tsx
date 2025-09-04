import { useNostoAppState } from "@nosto/search-js/preact/hooks"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

import { autocompleteHistoryStyles } from "../../../Component.styles"
import { AutocompleteHistoryElement } from "./AutocompleteHistoryElement"

export function AutocompleteHistory() {
  const historyItems = useNostoAppState(state => state.historyItems)
  const { highlightedElementIndex } = useContext(AutocompleteContext)

  if (!historyItems) {
    return null
  }

  return (
    <div style={autocompleteHistoryStyles.container}>
      <div style={autocompleteHistoryStyles.header}>Recent searches</div>
      {historyItems.map((item, index) => (
        <AutocompleteHistoryElement key={item} item={item} highlighted={index === highlightedElementIndex} />
      ))}
    </div>
  )
}
