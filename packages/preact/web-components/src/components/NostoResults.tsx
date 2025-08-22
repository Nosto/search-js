import { render } from "preact"
import { useEffect } from "preact/hooks"
import { SearchPageProvider } from "@preact/serp/SerpPageProvider"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { useResponse } from "@preact/hooks/useResponse"
import { useActions } from "@preact/hooks/useActions"
import { SerpElement } from "@preact/serp/components/SerpElement"
import { NostoBaseElement } from "./NostoBaseElement.tsx"
import { NOSTO_EVENTS, SearchEventDetail, ResultsUpdatedEventDetail } from "../types"

/**
 * ResultsWrapper component that renders search results
 */
function ResultsWrapper({ 
  config,
  onResultsUpdate 
}: { 
  config: any
  onResultsUpdate: (detail: ResultsUpdatedEventDetail) => void
}) {
  const { products } = useResponse()
  const { newSearch } = useActions()

  // Listen for search events from other components
  useEffect(() => {
    const handleSearch = (event: CustomEvent<SearchEventDetail>) => {
      const { query, filters, sort, page } = event.detail
      
      newSearch({
        query,
        products: {
          size: config.search?.products?.limit || 24,
          from: page ? (page - 1) * (config.search?.products?.limit || 24) : 0,
          filter: filters ? Object.entries(filters).map(([field, value]) => ({ 
            field, 
            value: Array.isArray(value) ? value : [String(value)] 
          })) : undefined,
          sort: sort ? [{ field: sort, order: "asc" }] : undefined
        }
      })
    }

    const unsubscribe = document.addEventListener(NOSTO_EVENTS.SEARCH, handleSearch as EventListener)
    return () => document.removeEventListener(NOSTO_EVENTS.SEARCH, handleSearch as EventListener)
  }, [newSearch, config])

  // Notify other components when results update
  useEffect(() => {
    if (products?.hits) {
      onResultsUpdate({
        results: products.hits,
        total: products.total || 0,
        page: products.from ? Math.floor(products.from / (config.search?.products?.limit || 24)) + 1 : 1,
        facets: products.facets
      })
    }
  }, [products, onResultsUpdate, config])

  if (!products?.hits) {
    return <div className="nosto-results-loading">Loading...</div>
  }

  if (products.hits.length === 0) {
    return <div className="nosto-results-empty">No results found</div>
  }

  return (
    <div className="nosto-results-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "16px",
      padding: "16px"
    }}>
      {products.hits.map((hit, index) => (
        <SerpElement
          key={hit.productId || index}
          hit={{ productId: hit.productId || `product-${index}`, url: hit.url }}
          as="div"
          componentProps={{
            style: {
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "12px",
              cursor: "pointer",
              transition: "box-shadow 0.2s ease"
            }
          }}
        >
          <div>
            {hit.imageUrl && (
              <img 
                src={hit.imageUrl} 
                alt={hit.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "8px"
                }}
              />
            )}
            <h3 style={{ 
              fontSize: "14px", 
              fontWeight: "600", 
              margin: "0 0 4px 0",
              lineHeight: "1.3"
            }}>
              {hit.name}
            </h3>
            {hit.price && (
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "700", 
                color: "#2563eb" 
              }}>
                {hit.price}
              </div>
            )}
            {hit.listPrice && hit.listPrice !== hit.price && (
              <div style={{ 
                fontSize: "14px", 
                color: "#6b7280", 
                textDecoration: "line-through" 
              }}>
                {hit.listPrice}
              </div>
            )}
          </div>
        </SerpElement>
      ))}
    </div>
  )
}

/**
 * NostoResults Web Component
 * 
 * Renders a grid of search result products.
 * 
 * @example
 * ```html
 * <nosto-results 
 *   account-id="shopify-12345"
 *   limit="24"
 *   columns="4">
 * </nosto-results>
 * ```
 */
export class NostoResults extends NostoBaseElement {
  
  protected _render() {
    if (!this.shadowRoot) return

    const config = makeSerpConfig({
      defaultCurrency: this._config.defaultCurrency || "EUR",
      search: this._config.search
    })

    const handleResultsUpdate = (detail: ResultsUpdatedEventDetail) => {
      this._dispatchNostoEvent(NOSTO_EVENTS.RESULTS_UPDATED, detail)
    }

    render(
      <SearchPageProvider config={config}>
        <ResultsWrapper 
          config={config}
          onResultsUpdate={handleResultsUpdate}
        />
      </SearchPageProvider>,
      this.shadowRoot
    )
  }

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      "columns"
    ]
  }
}