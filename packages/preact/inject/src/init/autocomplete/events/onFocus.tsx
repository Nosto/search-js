import { AutocompletePageProvider } from "@preact/autocomplete/AutocompletePageProvider"
import ErrorBoundary from "@preact/inject/components/ErrorBoundary"
import { render } from "preact"

import { InputEventContext } from "../bindAutocompleteInput"

export async function onFocus(value: string, { config, renderHistory, history, store }: InputEventContext) {
  const { historyEnabled, minQueryLength } = config
  if (!renderHistory || value.length >= minQueryLength || !historyEnabled || history.isOpen()) {
    return
  }

  history.show()
  const HistoryComponent = await renderHistory()
  render(
    <ErrorBoundary>
      <AutocompletePageProvider config={config} store={store}>
        {HistoryComponent}
      </AutocompletePageProvider>
    </ErrorBoundary>,
    history.element
  )
}
