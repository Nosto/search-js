import { render } from "preact"
import { useCallback, useEffect } from "preact/hooks"
import { SearchPageProvider } from "@preact/serp/SerpPageProvider"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { usePagination } from "@preact/hooks/usePagination"
import { useActions } from "@preact/hooks/useActions"
import { NostoBaseElement } from "./NostoBaseElement.tsx"
import { NOSTO_EVENTS, PageChangeEventDetail, ResultsUpdatedEventDetail } from "../types"

/**
 * PaginationWrapper component that manages pagination state
 */
function PaginationWrapper({ 
  onPageChange 
}: { 
  onPageChange: (detail: PageChangeEventDetail) => void 
}) {
  const { totalPages, current, prev, next, first, last, pages, resultsFrom, resultsTo } = usePagination()
  const { updateSearch } = useActions()

  const handlePageClick = useCallback((from: number, page: number) => {
    updateSearch({
      products: {
        from
      }
    })
    onPageChange({ page })
  }, [updateSearch, onPageChange])

  if (totalPages <= 1) {
    return null
  }

  const buttonStyle = {
    padding: "8px 12px",
    margin: "0 2px",
    border: "1px solid #e0e0e0",
    backgroundColor: "white",
    cursor: "pointer",
    borderRadius: "4px",
    fontSize: "14px"
  }

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white",
    borderColor: "#2563eb"
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    opacity: 0.5,
    cursor: "not-allowed"
  }

  return (
    <div className="nosto-pagination">
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        padding: "16px"
      }}>
        {prev && (
          <button
            onClick={() => handlePageClick(prev.from, prev.page)}
            style={buttonStyle}
          >
            Previous
          </button>
        )}

        {first && (
          <>
            <button
              onClick={() => handlePageClick(first.from, first.page)}
              style={buttonStyle}
            >
              {first.page}
            </button>
            <span style={{ padding: "8px 4px" }}>...</span>
          </>
        )}

        {pages.map(page => (
          <button
            key={page.page}
            onClick={() => handlePageClick(page.from, page.page)}
            style={page.current ? activeButtonStyle : buttonStyle}
          >
            {page.page}
          </button>
        ))}

        {last && (
          <>
            <span style={{ padding: "8px 4px" }}>...</span>
            <button
              onClick={() => handlePageClick(last.from, last.page)}
              style={buttonStyle}
            >
              {last.page}
            </button>
          </>
        )}

        {next && (
          <button
            onClick={() => handlePageClick(next.from, next.page)}
            style={buttonStyle}
          >
            Next
          </button>
        )}
      </div>

      <div style={{
        textAlign: "center",
        fontSize: "14px",
        color: "#666",
        marginTop: "8px"
      }}>
        Showing {resultsFrom} - {resultsTo} results
      </div>
    </div>
  )
}

/**
 * NostoPagination Web Component
 * 
 * Renders pagination controls for search results.
 * 
 * @example
 * ```html
 * <nosto-pagination 
 *   account-id="shopify-12345"
 *   limit="24">
 * </nosto-pagination>
 * ```
 */
export class NostoPagination extends NostoBaseElement {
  
  protected _render() {
    if (!this.shadowRoot) return

    const config = makeSerpConfig({
      defaultCurrency: this._config.defaultCurrency || "EUR",
      search: this._config.search
    })

    const handlePageChange = (detail: PageChangeEventDetail) => {
      this._dispatchNostoEvent(NOSTO_EVENTS.PAGE_CHANGE, detail)
    }

    render(
      <SearchPageProvider config={config}>
        <PaginationWrapper 
          onPageChange={handlePageChange} 
        />
      </SearchPageProvider>,
      this.shadowRoot
    )
  }
}