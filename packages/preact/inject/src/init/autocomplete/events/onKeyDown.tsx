import { Store } from "@preact/common/store/store"

import { AutocompleteInjectContext } from "../../injectAutocomplete"
import { AutocompleteDropdown } from "../components/AutocompleteDropdown"
import { AutocompleteHistory } from "../components/AutocompleteHistory"

export function onKeyDown(value: string, key: string, context: AutocompleteInjectContext) {
  const { config, debouncer, store } = context
  // Cancel debounce
  debouncer(() => {})
  if (value.length >= config.minQueryLength) {
    return elementControls(key, context.dropdown, context.history, store)
  } else if (config.historyEnabled) {
    return elementControls(key, context.history, context.dropdown, store)
  }
}

export function elementControls(
  key: string,
  activeElement: AutocompleteDropdown | AutocompleteHistory,
  inactiveElement: AutocompleteDropdown | AutocompleteHistory,
  store: Store
) {
  // Open when arrow down is pressed
  if (!activeElement.isOpen() && key === "ArrowDown") {
    activeElement.show()
    inactiveElement.hide()
    return
  }

  if (key === "Escape") {
    activeElement.hide()
    store.updateState({ highlightIndex: -1 })
  }

  if (!activeElement.isOpen()) {
    return
  }

  if (key === "ArrowDown") {
    activeElement.goDown()
    store.updateState({ highlightIndex: activeElement.highlightedIndex() })
  } else if (key === "ArrowUp") {
    activeElement.goUp()
    store.updateState({ highlightIndex: activeElement.highlightedIndex() })
  } else if (key === "Enter") {
    const highlighted = activeElement.highlightedIndex()
    if (highlighted >= 0) {
      activeElement.submitHighlightedItem(highlighted)
    }
    activeElement.hide()
    store.updateState({ highlightIndex: -1 })
    return highlighted >= 0 // Key handled
  }
}
