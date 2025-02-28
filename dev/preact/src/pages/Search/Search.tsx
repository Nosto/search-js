import { SearchInput } from "@nosto/search-js/preact"
import { useState } from "preact/hooks"

export function Search() {
  const [input, setInput] = useState("")
  return (
    <>
      <div>Totally working search:</div>
      <SearchInput onSearchInput={target => setInput(target.value)}>
        <>
          <input type="search" placeholder="Search" />
          <input type="search" placeholder="Search" />
          <input type="button" value="Search" />
        </>
      </SearchInput>
      <div>
        <b>{input}</b>
      </div>
    </>
  )
}
