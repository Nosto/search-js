import { AutocompleteConfig, AutocompletePageProvider } from "@nosto/search-js/preact/autocomplete"

import { hitDecorators } from "../../utils/hitDecorators"
import { AutocompleteSearchForm } from "./components/AutocompleteSearchForm"

export function Autocomplete() {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies AutocompleteConfig

  return (
    <div title="Autocomplete">
      <AutocompletePageProvider config={config}>
        <AutocompleteSearchForm />
      </AutocompletePageProvider>
    </div>
  )
}
