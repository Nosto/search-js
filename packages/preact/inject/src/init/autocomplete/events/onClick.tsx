import { newSearch } from "@preact/common/actions/newSearch"

import { AutocompleteInjectContext } from "../../injectAutocomplete"

export async function onClick(
  value: string,
  { config, dropdown, history, renderHistory, store }: AutocompleteInjectContext
) {
  const { historyEnabled, minQueryLength } = config

  if (value.length < minQueryLength && historyEnabled && renderHistory && !history.isOpen()) {
    history.show()
    return
  }

  if (value.length < minQueryLength) {
    return
  }

  dropdown.hide()
  const query = store.getState()?.query?.query
  if (query && query !== value) {
    await newSearch({ config, store }, { query: value })
  }
  dropdown.show()
}
