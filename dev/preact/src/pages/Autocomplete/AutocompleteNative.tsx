import { AutocompleteConfig, AutocompletePageProvider } from "@nosto/search-js/preact/autocomplete"

import { hitDecorators } from "../../utils/hitDecorators"
import { AutocompleteSearchForm } from "./components/AutocompleteSearchForm"

export function AutocompleteNative() {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies AutocompleteConfig

  return (
    <div title="Autocomplete (Native)">
      <AutocompletePageProvider config={config}>
        <AutocompleteSearchForm />
      </AutocompletePageProvider>
    </div>
  )
}
