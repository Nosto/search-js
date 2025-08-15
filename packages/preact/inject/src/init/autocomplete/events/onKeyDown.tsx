import { AutocompleteInjectContext } from "../../injectAutocomplete"
import { AutocompleteDropdown } from "../components/AutocompleteDropdown"
import { AutocompleteHistory } from "../components/AutocompleteHistory"

export function onKeyDown(value: string, key: string, context: AutocompleteInjectContext) {
  const { config, debouncer } = context
  // Cancel debounce
  debouncer(() => {})
  if (value.length >= config.minQueryLength) {
    return elementControls(key, context.dropdown, context.history)
  } else if (config.historyEnabled) {
    return elementControls(key, context.history, context.dropdown)
  }
}

export function elementControls(
  key: string,
  activeElement: AutocompleteDropdown | AutocompleteHistory,
  inactiveElement: AutocompleteDropdown | AutocompleteHistory
) {
  // Open when arrow down is pressed
  if (!activeElement.isOpen() && key === "ArrowDown") {
    activeElement.show()
    inactiveElement.hide()
    return
  }

  if (key === "Escape") {
    activeElement.hide()
  }

  if (!activeElement.isOpen()) {
    return
  }

  if (key === "ArrowDown") {
    activeElement.goDown()
  } else if (key === "ArrowUp") {
    activeElement.goUp()
  } else if (key === "Enter") {
    const highlighted = activeElement.highlightedIndex()
    if (highlighted >= 0) {
      activeElement.submitHighlightedItem(highlighted)
    }
    activeElement.hide()
    return highlighted >= 0 // Key handled
  }
}
