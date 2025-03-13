import { useActions, useNostoAppState } from "@nosto/search-js/preact"
import { useCallback, useEffect, useState } from "preact/hooks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Product } from "./Product"

export function SearchContent() {
  const [input, setInput] = useState(location.search.match(/q=([^&]+)/)?.[1] ?? "")
  const { newSearch } = useActions()

  const state = useNostoAppState()

  const onSearch = useCallback(() => {
    newSearch({
      query: input,
      products: {
        size: 12
      }
    })
    history.replaceState(null, "", `?q=${input}`)
  }, [input, newSearch])

  useEffect(() => {
    if (input.length > 3) {
      onSearch()
    }
  }, [input, onSearch])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Enter") {
      onSearch()
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        gap: 16,
        marginTop: 16,
        maxWidth: 1000
      }}
    >
      <div>
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <div style={{ display: "flex", gap: 16 }}>
          <Input
            id="search"
            value={input}
            onInput={event => {
              setInput((event.target as HTMLInputElement).value)
            }}
            onKeyPress={onKeyDown}
            placeholder="Search"
            type="search"
          />
          <Button onClick={onSearch}>Search</Button>
        </div>
      </div>
      <div>
        Searching for: <b>{input}</b>
      </div>
      {state.response.products?.hits.length && <div>Found {state.response.products?.hits.length} products</div>}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", overflow: "scroll", justifyContent: "space-around" }}>
        {state.response.products?.hits.map(hit => <Product key={hit.productId} product={hit} />)}
      </div>
    </div>
  )
}
