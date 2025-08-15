import { AutocompleteInjectContext } from "../../injectAutocomplete"

export function onSubmit(
  value: string,
  { config, dropdown, history, onNavigateToSearch, store }: AutocompleteInjectContext
) {
  dropdown.hide()
  history.hide()
  if (value.length < config.minQueryLength) {
    return
  }

  history.add(value)
  store.updateState({
    historyItems: history.get()
  })

  onNavigateToSearch?.({
    query: value
  })
}
