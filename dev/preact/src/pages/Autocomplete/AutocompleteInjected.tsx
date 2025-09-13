import { Button } from "../../components/Button"
import { useEffectOnce } from "../../utils/useEffectOnce"
import { styles } from "./AutocompleteInjected.styles"

export function AutocompleteInjected() {
  // Inject functionality has been removed
  useEffectOnce(() => {
    console.warn("Inject functionality has been removed from @nosto/search-js/preact/inject")
  })

  const handleSearch = () => {
    console.log("Native search")
  }

  return (
    <div title="Autocomplete (Injected - DEPRECATED)" style={styles.container}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffe6e6",
          border: "1px solid #ff9999",
          borderRadius: "4px",
          marginBottom: "20px"
        }}
      >
        <strong>Notice:</strong> The inject functionality has been removed. This component no longer works as intended.
      </div>
      <form id="inject-autocomplete-form" onSubmit={handleSearch} style={styles.form}>
        <input id="inject-autocomplete-input" type="search" placeholder="Search for products..." style={styles.input} />
        <Button type="submit">Search</Button>
      </form>
      <div style={styles.dropdownContainer}>
        <div id="inject-autocomplete-dropdown"></div>
      </div>
    </div>
  )
}
