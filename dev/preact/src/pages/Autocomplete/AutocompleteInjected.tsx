import { AutocompleteConfig, AutocompletePageProvider, SearchInput } from "@nosto/search-js/preact/autocomplete"
import { useEventBusDispatch } from "@nosto/search-js/preact/events"
import { useActions } from "@nosto/search-js/preact/hooks"
import { createContext } from "preact"
import { createPortal } from "preact/compat"
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks"

import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { debounce } from "../../utils/debounce"
import { styles } from "./AutocompleteInjected.styles"
import { AutocompleteContent } from "./components/AutocompleteContent"
import { AutocompleteHistory } from "./components/AutocompleteHistory"

// Simple context for injected autocomplete
export const AutocompleteContext = createContext({
  reportProductClick: () => {},
  reportKeywordClick: () => {},
  handleSubmit: () => {},
  highlightedElementIndex: -1
})

export function AutocompleteInjected() {
  const triggerNewSearch = useEventBusDispatch({ event: "actions/newSearch" })
  const { newSearch } = useActions()

  const [input, setInput] = useState("")
  const [autocompleteShown, setAutocompleteShown] = useState(false)
  const [historyShown, setHistoryShown] = useState(false)
  const [dropdownContainer, setDropdownContainer] = useState<Element | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const config = {
    defaultCurrency: "EUR"
  } satisfies AutocompleteConfig

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        newSearch({
          query: query
        })
      }, 300),
    [newSearch]
  )

  // Initialize dropdown container
  useEffect(() => {
    const container = document.getElementById("inject-autocomplete-dropdown")
    if (container) {
      setDropdownContainer(container)
    }
  }, [])

  const onSearchInput = useCallback(
    (value: string) => {
      setInput(value)
      const minQueryLength = 2 // Default from config

      if (value.length < minQueryLength) {
        setAutocompleteShown(false)
        setHistoryShown(true) // Show history when query is too short
      } else {
        setHistoryShown(false)
        setAutocompleteShown(true)
        debouncedSearch(value)
      }
    },
    [debouncedSearch]
  )

  const onNavigateToSearch = useCallback(
    (query: string) => {
      if (window.location.pathname.startsWith("/search")) {
        triggerNewSearch({
          query: query,
          targetStore: "search"
        })
      } else {
        window.location.href = `/search/?q=${query}`
      }
    },
    [triggerNewSearch]
  )

  const handleSearch = useCallback(
    (e: Event) => {
      e.preventDefault()
      if (input.trim()) {
        // Cancel any pending debounced search
        debouncedSearch.cancel?.()
        onNavigateToSearch(input.trim())
        setAutocompleteShown(false)
        setHistoryShown(false)
      }
    },
    [input, debouncedSearch, onNavigateToSearch]
  )

  const handleFocus = useCallback(() => {
    if (input.length < 2) {
      setHistoryShown(true)
    }
  }, [input])

  const handleBlur = useCallback(() => {
    // Delay hiding to allow click on dropdown items
    setTimeout(() => {
      setAutocompleteShown(false)
      setHistoryShown(false)
    }, 150)
  }, [])

  const contextValue = useMemo(
    () => ({
      reportProductClick: () => {},
      reportKeywordClick: () => {},
      handleSubmit: () => {},
      highlightedElementIndex: -1
    }),
    []
  )

  return (
    <AutocompletePageProvider config={config}>
      <AutocompleteContext.Provider value={contextValue}>
        <div title="Autocomplete (Injected)" style={styles.container}>
          <form id="inject-autocomplete-form" onSubmit={handleSearch} style={styles.form}>
            <SearchInput
              as={Input}
              ref={inputRef}
              componentProps={{
                id: "inject-autocomplete-input",
                placeholder: "Search for products...",
                style: styles.input,
                onFocus: handleFocus,
                onBlur: handleBlur
              }}
              onSearchInput={target => onSearchInput(target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
          <div style={styles.dropdownContainer}>
            <div id="inject-autocomplete-dropdown"></div>
          </div>

          {/* Render autocomplete content via portal into the dropdown container */}
          {dropdownContainer && autocompleteShown && createPortal(<AutocompleteContent />, dropdownContainer)}

          {/* Render history content via portal into the dropdown container */}
          {dropdownContainer && historyShown && createPortal(<AutocompleteHistory />, dropdownContainer)}
        </div>
      </AutocompleteContext.Provider>
    </AutocompletePageProvider>
  )
}
