import { init } from "@nosto/search-js/preact/inject"

import { Button } from "../../components/Button"
import { AutocompleteContent } from "./components/AutocompleteContent"

export function AutocompleteInjected() {
  init({
    autocomplete: {
      config: {
        defaultCurrency: "EUR"
      },
      formCssSelector: "#inject-autocomplete-form",
      inputCssSelector: "#inject-autocomplete-input",
      dropdownCssSelector: "#inject-autocomplete-dropdown",
      onNavigateToSearch: () => {
        console.log("onNavigateToSearch")
      },
      renderAutocomplete: () => <AutocompleteContent />,
      query: {
        keywords: {
          fields: ["keyword", "_highlight.keyword"],
          size: 5,
          facets: ["*"]
        }
      }
    }
  })

  const handleSearch = () => {
    console.log("Native search")
  }

  return (
    <div title="Autocomplete (Injected)">
      <form
        id="inject-autocomplete-form"
        onSubmit={handleSearch}
        style={{
          position: "relative",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          maxWidth: "500px",
          margin: "0 auto"
        }}
      >
        <input
          id="inject-autocomplete-input"
          type="search"
          placeholder="Search for products..."
          style={{
            flex: "1",
            padding: "12px 16px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "8px",
            outline: "none"
          }}
        />
        <Button type="submit">Search</Button>
        <div id="inject-autocomplete-dropdown"></div>
      </form>
    </div>
  )
}
