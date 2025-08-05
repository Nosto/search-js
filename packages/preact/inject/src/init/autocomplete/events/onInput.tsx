import { newSearch } from "@preact/common/actions/newSearch"

import { InputEventContext } from "../bindAutocompleteInput"

export async function onInput(value: string, { config, dropdown, history, store, debouncer }: InputEventContext) {
  const { minQueryLength, historyEnabled } = config

  // Query too short, no history
  if (value.length < minQueryLength && !historyEnabled) {
    dropdown.hide()
    history.hide()
    return
  }

  // Query too short, show history
  if (value.length < minQueryLength && historyEnabled) {
    dropdown.hide()
    history.show()
    return
  }

  history.hide()
  debouncer(async () => {
    newSearch({ config, store }, { query: value })
    dropdown.show()
  })
}
