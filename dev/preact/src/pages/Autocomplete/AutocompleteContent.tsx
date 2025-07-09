import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { Results } from "./Results"

export function AutocompleteContent() {
  const { hits, loading, initialized } = useNostoAppState(state => ({
    hits: state.response.products?.hits || [],
    loading: state.loading,
    initialized: state.initialized
  }))

  // Don't show the dropdown if not initialized or no results and not loading
  if (!initialized || hits.length === 0 || loading) {
    return null
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        maxHeight: "400px",
        overflow: "auto",
        marginTop: "4px"
      }}
    >
      <Results loading={loading} hits={hits} initialized={initialized} />
    </div>
  )
}
