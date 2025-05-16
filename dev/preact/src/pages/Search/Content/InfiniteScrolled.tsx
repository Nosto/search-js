import { SearchInput } from "@nosto/search-js/preact/autocomplete"
import { InfiniteScroll } from "@nosto/search-js/preact/common"
import { useActions, useNostoAppState } from "@nosto/search-js/preact/hooks"
import { useState } from "preact/hooks"

import { Product } from "../Product"

export function InfiniteScrolled() {
  const [input, setInput] = useState("")
  const { newSearch } = useActions()

  const { hits } = useNostoAppState(state => ({ hits: state.response.products?.hits || [] }))

  const onSearch = () => {
    newSearch({
      query: input
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 16, marginTop: 16 }}>
      <div>
        <div>Totally working search with infinite scrolling:</div>
        <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
          <SearchInput onSearchInput={target => setInput(target.value)} />
          <input type="button" value="Search" onClick={onSearch} />
        </div>
      </div>
      <div>
        Searching for: <b>{input}</b>
      </div>
      <div>Results: {hits.map(hit => hit.name).join(", ")}</div>
      <InfiniteScroll pageSize={5}>
        {hits.map(hit => (
          <Product key={hit.productId} product={hit} />
        ))}
      </InfiniteScroll>
    </div>
  )
}
