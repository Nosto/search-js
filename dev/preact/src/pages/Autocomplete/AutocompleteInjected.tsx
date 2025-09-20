import { SearchKeyword, SearchProduct, SearchQuery } from "@nosto/nosto-js/client"
import { useEventBusDispatch } from "@nosto/search-js/preact/events"
import { createContext } from "preact"
import { createPortal } from "preact/compat"
import { useRef } from "preact/hooks"

import { Button } from "../../components/Button"
import { SpeechToTextButton } from "../Search/components/SpeechToTextButton"
import { styles } from "./AutocompleteInjected.styles"
import { AutocompleteContent } from "./components/AutocompleteContent"
import { AutocompleteHistory } from "./components/AutocompleteHistory"

// Create a local context to replace the inject context
type LocalAutocompleteContext = {
  reportProductClick: (product: SearchProduct) => void
  reportKeywordClick: (keyword: SearchKeyword) => void
  handleSubmit: (query: SearchQuery) => void
  highlightedElementIndex: number
}

const LocalAutocompleteContext = createContext<LocalAutocompleteContext>({
  reportProductClick: () => {},
  reportKeywordClick: () => {},
  handleSubmit: () => {},
  highlightedElementIndex: -1
})

export function AutocompleteInjected() {
  const triggerNewSearch = useEventBusDispatch({ event: "actions/newSearch" })
  const dropdownRef = useRef<HTMLDivElement>(null)

  const contextValue: LocalAutocompleteContext = {
    reportProductClick: (product: SearchProduct) => {
      const query = product.name!
      if (window.location.pathname.startsWith("/search")) {
        triggerNewSearch({
          query: { query },
          targetStore: "search"
        })
      } else {
        window.location.href = `/search/?q=${query}`
      }
    },
    reportKeywordClick: (keyword: SearchKeyword) => {
      const query = keyword.keyword
      if (window.location.pathname.startsWith("/search")) {
        triggerNewSearch({
          query: { query },
          targetStore: "search"
        })
      } else {
        window.location.href = `/search/?q=${query}`
      }
    },
    handleSubmit: (query: SearchQuery) => {
      if (window.location.pathname.startsWith("/search")) {
        triggerNewSearch({
          query,
          targetStore: "search"
        })
      } else {
        window.location.href = `/search/?q=${query.query}`
      }
    },
    highlightedElementIndex: -1
  }

  const handleSearch = () => {
    console.log("Native search")
  }

  return (
    <LocalAutocompleteContext.Provider value={contextValue}>
      <div title="Autocomplete (Injected)" style={styles.container}>
        <form id="inject-autocomplete-form" onSubmit={handleSearch} style={styles.form}>
          <input
            id="inject-autocomplete-input"
            type="search"
            placeholder="Search for products..."
            style={styles.input}
          />
          <Button type="submit">Search</Button>
          {createPortal(<SpeechToTextButton />, document.body)}
        </form>
        <div style={styles.dropdownContainer}>
          <div id="inject-autocomplete-dropdown" ref={dropdownRef}>
            {dropdownRef.current &&
              createPortal(
                <>
                  <AutocompleteContent />
                  <AutocompleteHistory />
                </>,
                dropdownRef.current
              )}
          </div>
        </div>
      </div>
    </LocalAutocompleteContext.Provider>
  )
}

// Export the context for components to use
export { LocalAutocompleteContext as AutocompleteContext }
