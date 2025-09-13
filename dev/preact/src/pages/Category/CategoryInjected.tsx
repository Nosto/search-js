import { useEffectOnce } from "../../utils/useEffectOnce"
import { styles } from "./CategoryInjected.styles"

export function CategoryInject() {
  // Inject functionality has been removed
  useEffectOnce(() => {
    console.warn("Inject functionality has been removed from @nosto/search-js/preact/inject")
  })

  return (
    <div className="category" title="Category (Injected - DEPRECATED)" style={styles.container}>
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
      <div id="inject-category" />
    </div>
  )
}
