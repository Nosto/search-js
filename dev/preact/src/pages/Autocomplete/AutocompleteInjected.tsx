import { init } from "@nosto/search-js/preact/inject"

export function AutocompleteInjected() {
  // TODO: Actually inject from here
  init({
    autocomplete: {
      inputSelector: "#inject-autocomplete",
      dropdownSelector: "#inject-autocomplete-dropdown"
    }
  })

  return (
    <div title="Autocomplete (Injected)">
      <span>Injected autocomplete will be here</span>
      <div id="inject-autocomplete" />
    </div>
  )
}
