import { newSearch } from "@preact/common/actions/newSearch"

import { AutocompleteInjectContext } from "../../injectAutocomplete"

export async function onInput(
  value: string,
  { config, dropdown, history, store, debouncer }: AutocompleteInjectContext
) {
  const { minQueryLength, historyEnabled } = config

  // Query too short, no history
  if (value.length < minQueryLength && !historyEnabled) {
    dropdown.hide()
    history.hide()
    return
  }

  // Query too short, history enabled
  if (value.length < minQueryLength && historyEnabled) {
    dropdown.hide()
    history.show()
    return
  }

  // Query is just right
  history.hide()
  debouncer(async () => {
    newSearch({ config, store }, { query: value })
    dropdown.show()
  })
}
