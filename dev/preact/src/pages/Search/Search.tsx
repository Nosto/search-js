import { SearchInput } from "@nosto/search-js/preact"

export function Search() {
  return (
    <>
      <div>Totally working search:</div>
      <SearchInput onSearchInput={target => console.log(target.value)}>
        <>
          <input type="search" placeholder="Search" />
          <input type="search" placeholder="Search" />
          <input type="button" value="Search" />
        </>
      </SearchInput>
    </>
  )
}
