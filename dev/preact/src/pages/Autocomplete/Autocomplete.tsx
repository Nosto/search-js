import { AutocompleteConfig, AutocompletePageProvider } from "@nosto/search-js/preact/autocomplete"

import { hitDecorators } from "../../utils/hitDecorators"
import { AutocompleteSearchForm } from "./AutocompleteSearchForm"

export function Autocomplete() {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies AutocompleteConfig

  return (
    <div>
      <AutocompletePageProvider config={config}>
        <AutocompleteSearchForm />
      </AutocompletePageProvider>
    </div>
  )
}
