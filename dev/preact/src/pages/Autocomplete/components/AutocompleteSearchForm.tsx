import { SearchInput } from "@nosto/search-js/preact/autocomplete"
import { useActions } from "@nosto/search-js/preact/hooks"
import { useCallback, useMemo, useState } from "preact/hooks"

import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { debounce } from "../../../utils/debounce"
import { SpeechToTextButton } from "../../Search/components/SpeechToTextButton"
import { AutocompleteContent } from "./AutocompleteContent"
import { styles } from "./AutocompleteSearchForm.styles"

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
    <form onSubmit={handleSearch} style={styles.form}>
      <SearchInput
        as={Input}
        componentProps={{
          id: "autocomplete-search-input",
          placeholder: "Search for products...",
          style: styles.searchInput
        }}
        onSearchInput={target => onSearchInput(target.value)}
      />
      <SpeechToTextButton />
      <Button type="submit">Search</Button>
      {autocompleteShown && <AutocompleteContent />}
    </form>
  )
}
