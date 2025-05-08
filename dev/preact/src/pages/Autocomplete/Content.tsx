import { SearchInput } from "@nosto/search-js/preact/autocomplete"
import { useActions, useNostoAppState } from "@nosto/search-js/preact/hooks"
import { useEffect, useState } from "preact/hooks"

import { Input } from "../../components/Input"
import { Results } from "./Results"

export function Content() {
  const [input, setInput] = useState("")
  const { newSearch } = useActions()

  const { hits, loading, initialized } = useNostoAppState(state => ({
    hits: state.response.products?.hits || [],
    loading: state.loading,
    initialized: state.initialized
  }))

  useEffect(() => {
    if (input.length > 2) {
      newSearch({
        query: input
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  return (
    <div>
      <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
        <SearchInput
          as={Input}
          componentProps={{ placeholder: "Test" }}
          onSearchInput={target => {
            setInput(target.value)
          }}
        />
      </div>
      <Results loading={loading} hits={hits} initialized={initialized} />
    </div>
  )
}
