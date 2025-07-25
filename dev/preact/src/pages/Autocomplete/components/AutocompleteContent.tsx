import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { AutocompleteResults } from "./AutocompleteResults"

export function AutocompleteContent() {
  const { hits, keywords, loading, initialized } = useNostoAppState(state => ({
    hits: state.response.products?.hits || [],
    keywords: state.response.keywords?.hits || [],
    loading: state.loading,
    initialized: state.initialized
  }))

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
      <AutocompleteResults loading={loading} hits={hits} keywords={keywords} initialized={initialized} />
    </div>
  )
}
