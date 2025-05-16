import { SearchInput } from "@nosto/search-js/preact/autocomplete"
import { speechToTextSupported, useActions, useNostoAppState, useSpeechToText } from "@nosto/search-js/preact/hooks"
import { useState } from "preact/hooks"

import { Input } from "../../../components/Input"
import { Pagination } from "../../../components/Pagination"
import { Product } from "../Product"

function SpeechToTextButton() {
  const { newSearch } = useActions()
  const { startListening, listening, stopListening } = useSpeechToText()

  if (!speechToTextSupported) {
    return null
  }

  return (
    <button
      onClick={() => {
        if (listening) {
          stopListening()
        } else {
          startListening({
            onResult: value => {
              newSearch({
                query: value
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
        <div style={{ display: "flex", gap: 4, width: "100%", justifyContent: "center" }}>
          <SearchInput
            as={Input}
            componentProps={{ placeholder: "Search" }}
            onSearchInput={target => setInput(target.value)}
          />
          <input type="button" value="Search" onClick={onSearch} />
          <SpeechToTextButton />
        </div>
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
