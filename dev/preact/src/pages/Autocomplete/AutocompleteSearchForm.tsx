import { SearchInput } from "@nosto/search-js/preact/autocomplete"
import { useActions } from "@nosto/search-js/preact/hooks"
import { useCallback, useMemo, useState } from "preact/hooks"

import { Input } from "../../components/Input"
import { debounce } from "../../utils/debounce"
import { SpeechToTextButton } from "../Search/SpeechToTextButton"
import { AutocompleteContent } from "./AutocompleteContent"

export function AutocompleteSearchForm() {
  const [input, setInput] = useState("")
  const [autocompleteShown, setAutocompleteShown] = useState(false)
  const { newSearch } = useActions()

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        newSearch({
          query: query
        })
      }, 300),
    [newSearch]
  )

  const onSearchInput = useCallback(
    (value: string) => {
      setInput(value)
      setAutocompleteShown(value.length > 2)
      if (value.length > 2) {
        debouncedSearch(value)
      }
    },
    [debouncedSearch]
  )

  const onSearch = useCallback((query: string) => {
    const url = `/search?q=${encodeURIComponent(query)}`
    history.pushState(null, "", url)
    window.dispatchEvent(new PopStateEvent("popstate"))
  }, [])

  const handleSearch = (e: Event) => {
    e.preventDefault()
    if (input.trim()) {
      // Cancel any pending debounced search
      debouncedSearch.cancel?.()
      onSearch(input.trim())
      setAutocompleteShown(false)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      style={{
        position: "relative",
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        maxWidth: "500px",
        margin: "0 auto"
      }}
    >
      <SearchInput
        as={Input}
        componentProps={{
          placeholder: "Search for products...",
          style: {
            flex: "1",
            padding: "12px 16px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "8px",
            outline: "none"
          }
        }}
        onSearchInput={target => onSearchInput(target.value)}
      />
      <button
        type="submit"
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#673ab8",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "500"
        }}
      >
        Search
      </button>
      <SpeechToTextButton />
      {autocompleteShown && <AutocompleteContent />}
    </form>
  )
}
