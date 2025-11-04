import { getRedirectUrl } from "@core/withRedirects"

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

  // Check if there's a redirect for this query
  const response = store.getState().response
  const redirectUrl = getRedirectUrl(value, response)

  if (redirectUrl) {
    // Navigate to the redirect URL instead of going through onSubmit flow
    if (typeof window !== "undefined") {
      window.location.href = redirectUrl
    }
    return
  }

  onNavigateToSearch?.({
    query: value
  })
}
