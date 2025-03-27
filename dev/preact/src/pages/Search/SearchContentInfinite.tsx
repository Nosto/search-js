import { InfiniteScroll, SearchInput, useActions, useNostoAppState } from "@nosto/search-js/preact"
import { useState } from "preact/hooks"

import { Product } from "./Product"

export function SearchContentInfinite() {
  const [input, setInput] = useState("")
  const { newSearch } = useActions()

  const state = useNostoAppState()

  const onSearch = () => {
    newSearch({
      query: input
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16, marginTop: 16 }}>
      <div>
        <div>Totally working search with infinite scrolling:</div>
        <SearchInput onSearchInput={target => setInput(target.value)}>
          <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
            <input type="search" placeholder="Search" />
            <input type="button" value="Search" onClick={onSearch} />
          </div>
        </SearchInput>
      </div>
      <div>
        Searching for: <b>{input}</b>
      </div>
      <div>Results: {state.response.products?.hits.map(hit => hit.name).join(", ")}</div>
      <InfiniteScroll pageSize={5}>
        {state.response.products?.hits.map(hit => <Product key={hit.productId} product={hit} />)}
      </InfiniteScroll>
    </div>
  )
}
