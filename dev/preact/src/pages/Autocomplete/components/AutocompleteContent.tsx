import { useNostoAppState } from "@nosto/search-js/preact/hooks"

import { autocompleteContentStyles } from "../../../Component.styles"
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
    <div style={autocompleteContentStyles.container}>
      <AutocompleteResults loading={loading} hits={hits} keywords={keywords} initialized={initialized} />
    </div>
  )
}
