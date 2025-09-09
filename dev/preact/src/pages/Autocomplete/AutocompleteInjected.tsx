import { useEventBusDispatch } from "@nosto/search-js/preact/events"
import { init } from "@nosto/search-js/preact/inject"

import { Button } from "../../components/Button"
import { useEffectOnce } from "../../utils/useEffectOnce"
import { SpeechToTextButton } from "../Search/components/SpeechToTextButton"
import { styles } from "./AutocompleteInjected.styles"
import { AutocompleteContent } from "./components/AutocompleteContent"
import { AutocompleteHistory } from "./components/AutocompleteHistory"

export function AutocompleteInjected() {
  const triggerNewSearch = useEventBusDispatch({ event: "actions/newSearch" })

  useEffectOnce(() => {
    init({
      autocomplete: {
        config: {
          defaultCurrency: "EUR"
        },
        formCssSelector: "#inject-autocomplete-form",
        inputCssSelector: "#inject-autocomplete-input",
        dropdownCssSelector: "#inject-autocomplete-dropdown",
        onNavigateToSearch: query => {
          if (window.location.pathname.startsWith("/search")) {
            triggerNewSearch({
              query,
              targetStore: "search"
            })
          } else {
            window.location.href = `/search/?q=${query.query}`
          }
        },
        renderAutocomplete: () => <AutocompleteContent />,
        renderHistory: () => <AutocompleteHistory />,
        renderSpeechToText: () => <SpeechToTextButton />,
        query: {
          keywords: {
            fields: ["keyword", "_highlight.keyword"],
            size: 5,
            facets: ["*"]
          }
        }
      }
    })
  })

  const handleSearch = () => {
    console.log("Native search")
  }

  return (
    <div title="Autocomplete (Injected)" style={styles.container}>
      <form id="inject-autocomplete-form" onSubmit={handleSearch} style={styles.form}>
        <input id="inject-autocomplete-input" type="search" placeholder="Search for products..." style={styles.input} />
        <Button type="submit">Search</Button>
      </form>
      <div style={styles.dropdownContainer}>
        <div id="inject-autocomplete-dropdown"></div>
      </div>
    </div>
  )
}
