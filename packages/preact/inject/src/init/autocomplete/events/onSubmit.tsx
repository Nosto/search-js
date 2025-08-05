import { InputEventContext } from "../bindAutocompleteInput"

export function onSubmit(value: string, { config, dropdown, history, onNavigateToSearch, store }: InputEventContext) {
  if (!dropdown.isOpen()) {
    return
  }

  dropdown.hide()
  history.hide()
  if (value.length < config.minQueryLength) {
    return
  }

  history.add(value)
  store.updateState({
    historyItems: history.get()
  })
  const highlighted = dropdown.highlightedIndex()
  if (highlighted >= 0) {
    dropdown.submitHighlightedItem(highlighted)
    return
  }
  onNavigateToSearch?.({
    query: value
  })
}
