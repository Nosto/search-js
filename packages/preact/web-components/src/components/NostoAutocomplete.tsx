import { render } from "preact"
import { useCallback, useState } from "preact/hooks"
import { SearchInput } from "@preact/autocomplete/components/SearchInput"
import { AutocompletePageProvider } from "@preact/autocomplete/AutocompletePageProvider"
import { makeAutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { useActions } from "@preact/hooks/useActions"
import { useResponse } from "@preact/hooks/useResponse"
import { AutocompleteElement } from "@preact/autocomplete/components/AutocompleteElement"
import { NostoBaseElement } from "./NostoBaseElement.tsx"
import { NOSTO_EVENTS, AutocompleteSelectEventDetail, SearchEventDetail } from "../types"

/**
 * AutocompleteWrapper component that handles the autocomplete logic
 */
function AutocompleteWrapper({ 
  config, 
  onSelect, 
  onSearch 
}: { 
  config: any
  onSelect: (detail: AutocompleteSelectEventDetail) => void
  onSearch: (detail: SearchEventDetail) => void
}) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  
  const { newSearch } = useActions()
  const { products, keywords } = useResponse()

  const handleInput = useCallback((target: HTMLInputElement) => {
    const value = target.value
    setQuery(value)
    
    if (value.length >= (config.minQueryLength || 2)) {
      newSearch({
        query: value,
        products: {
          size: config.search?.products?.limit || 5
        }
      })
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [newSearch, config])

  const handleSelect = useCallback((hit: any) => {
    if (hit && "productId" in hit) {
      onSelect({ hit })
    } else if (hit && "keyword" in hit) {
      onSelect({ query: hit.keyword })
      onSearch({ query: hit.keyword })
    }
    setIsOpen(false)
  }, [onSelect, onSearch])

  const handleSearch = useCallback((event: Event) => {
    event.preventDefault()
    if (query.trim()) {
      onSearch({ query: query.trim() })
      setIsOpen(false)
    }
  }, [query, onSearch])

  const hasResults = (products.hits && products.hits.length > 0) || (keywords.hits && keywords.hits.length > 0)

  return (
    <div className="nosto-autocomplete">
      <form onSubmit={handleSearch}>
        <SearchInput 
          onSearchInput={handleInput}
          componentProps={{
            placeholder: "Search products...",
            value: query,
            "aria-expanded": isOpen,
            "aria-haspopup": "listbox",
            role: "combobox"
          }}
        />
      </form>
      
      {isOpen && hasResults && (
        <div 
          className="nosto-autocomplete-dropdown"
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            maxHeight: "300px",
            overflow: "auto",
            width: "100%"
          }}
        >
          {keywords.hits?.map((hit, index) => (
            <AutocompleteElement
              key={hit.keyword || index}
              hit={{ keyword: hit.keyword }}
              as="div"
              componentProps={{
                onClick: () => handleSelect(hit),
                role: "option",
                style: {
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                }
              }}
            >
              <div>{hit.keyword}</div>
            </AutocompleteElement>
          ))}
          
          {products.hits?.map((hit, index) => (
            <AutocompleteElement
              key={hit.productId || index}
              hit={{ productId: hit.productId || `product-${index}`, url: hit.url }}
              as="div"
              componentProps={{
                onClick: () => handleSelect(hit),
                role: "option",
                style: {
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee"
                }
              }}
            >
              <div>
                <div>{hit.name}</div>
                {hit.price && <div style={{ fontSize: "0.9em", color: "#666" }}>{hit.price}</div>}
              </div>
            </AutocompleteElement>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * NostoAutocomplete Web Component
 * 
 * Wraps an input field and renders an autocomplete dropdown with search suggestions.
 * 
 * @example
 * ```html
 * <nosto-autocomplete 
 *   account-id="shopify-12345"
 *   default-currency="USD"
 *   limit="10">
 * </nosto-autocomplete>
 * ```
 */
export class NostoAutocomplete extends NostoBaseElement {
  
  protected _render() {
    if (!this.shadowRoot) return

    const config = makeAutocompleteConfig({
      defaultCurrency: this._config.defaultCurrency || "EUR",
      search: this._config.search,
      minQueryLength: parseNumber(this.getAttribute("min-query-length")) || 2,
      debounceDelay: parseNumber(this.getAttribute("debounce-delay")) || 500
    })

    const handleSelect = (detail: AutocompleteSelectEventDetail) => {
      this._dispatchNostoEvent(NOSTO_EVENTS.AUTOCOMPLETE_SELECT, detail)
    }

    const handleSearch = (detail: SearchEventDetail) => {
      this._dispatchNostoEvent(NOSTO_EVENTS.SEARCH, detail)
    }

    render(
      <AutocompletePageProvider config={config}>
        <AutocompleteWrapper 
          config={config}
          onSelect={handleSelect}
          onSearch={handleSearch}
        />
      </AutocompletePageProvider>,
      this.shadowRoot
    )
  }

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      "min-query-length",
      "debounce-delay"
    ]
  }
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? undefined : parsed
}