import { SearchInput } from "@nosto/search-js/preact/autocomplete"
import { useActions, useNostoAppState, useSpeechToText } from "@nosto/search-js/preact/hooks"
import { useState } from "preact/hooks"

import { Pagination } from "../../../components/Pagination"
import { Product } from "../Product"

function STTButton() {
  const { newSearch } = useActions()
  const { startListening, isListening, stopListening, isSupported } = useSpeechToText()

  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={() => {
        if (isListening) {
          stopListening()
        } else {
          startListening({
            onResult: result => {
              newSearch({
                query: result
              })
            }
          })
        }
      }}
    >
      🎤︎︎
    </button>
  )
}

export function Paginated() {
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
        <div>Totally working search:</div>
        <SearchInput onSearchInput={target => setInput(target.value)}>
          <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
            <input type="search" placeholder="Search" />
            <input type="button" value="Search" onClick={onSearch} />
            <STTButton />
          </div>
        </SearchInput>
      </div>
      <div>
        Searching for: <b>{input}</b>
      </div>
      <div>Results: {hits.map(hit => hit.name).join(", ")}</div>
      <div>
        {hits.map(hit => (
          <Product key={hit.productId} product={hit} />
        ))}
      </div>
      <Pagination />
    </div>
  )
}
