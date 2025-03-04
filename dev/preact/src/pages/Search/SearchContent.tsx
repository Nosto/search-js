import { SearchInput, useActions, useNostoAppState } from "@nosto/search-js/preact"
import { useEffect, useState } from "preact/hooks"

export function SearchContent() {
  const [input, setInput] = useState("")
  const { newSearch } = useActions()

  const state = useNostoAppState()

  useEffect(() => {
    if (input.length >= 3) {
      newSearch({
        query: input
      })
    }
  }, [input])

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16, marginTop: 16 }}>
      <div>
        <div>Totally working search:</div>
        <SearchInput onSearchInput={target => setInput(target.value)}>
          <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
            <input type="search" placeholder="Search" />
            <input type="button" value="Search" />
          </div>
        </SearchInput>
      </div>
      <div>
        Searching for: <b>{input}</b>
      </div>
      <div>Results: {state.response.products?.hits.map(hit => hit.name).join(", ")}</div>
      <div>{/* <Product /> */}</div>
    </div>
  )
}
