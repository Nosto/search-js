import { useEffectOnce } from "../../utils/useEffectOnce"
import { Autocomplete } from "../Autocomplete/Autocomplete"
import { styles } from "./SearchInjected.styles"

export function SearchInjected() {
  // Inject functionality has been removed
  useEffectOnce(() => {
    console.warn("Inject functionality has been removed from @nosto/search-js/preact/inject")
  })

  return (
    <div className="search" title="Search (Injected - DEPRECATED)" style={styles.container}>
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
      <Autocomplete />
      <div id="inject-search" />
    </div>
  )
}
