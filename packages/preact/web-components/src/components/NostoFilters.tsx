import type { SearchTermsFacet } from "@nosto/nosto-js/client"
import { useFacet } from "@preact/hooks/useFacet"
import { useFacets } from "@preact/hooks/useFacets"
import { useSelectedFiltersCount } from "@preact/hooks/useSelectedFiltersCount"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { SearchPageProvider } from "@preact/serp/SerpPageProvider"
import { render } from "preact"
import { useCallback } from "preact/hooks"

import { FilterChangeEventDetail, NOSTO_EVENTS } from "../types"
import { NostoBaseElement } from "./NostoBaseElement.tsx"

/**
 * Filter component for a single facet
 */
function FilterFacet({
  facet,
  onFilterChange
}: {
  facet: SearchTermsFacet
  onFilterChange: (detail: FilterChangeEventDetail) => void
}) {
  const { active, selectedFiltersCount, toggleActive, toggleProductFilter } = useFacet(facet)

  const handleFilterToggle = useCallback(
    (value: string, selected: boolean) => {
      toggleProductFilter(facet.field, value, selected)
      onFilterChange({
        field: facet.field,
        value,
        active: selected
      })
    },
    [facet.field, toggleProductFilter, onFilterChange]
  )

  if (facet.type !== "terms" || !facet.data?.length) {
    return null
  }

  return (
    <div className="nosto-filter-facet" style={{ marginBottom: "16px" }}>
      <button
        onClick={toggleActive}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #e0e0e0",
          backgroundColor: "#f9f9f9",
          cursor: "pointer",
          textAlign: "left",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>{facet.name}</span>
        <span>
          {selectedFiltersCount > 0 && (
            <span
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "12px",
                marginRight: "8px"
              }}
            >
              {selectedFiltersCount}
            </span>
          )}
          <span>{active ? "−" : "+"}</span>
        </span>
      </button>

      {active && (
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderTop: "none",
            maxHeight: "200px",
            overflow: "auto"
          }}
        >
          {facet.data.map(option => (
            <label
              key={option.value}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f0f0f0"
              }}
            >
              <input
                type="checkbox"
                checked={option.selected || false}
                onChange={e => handleFilterToggle(option.value, e.currentTarget.checked)}
                style={{ marginRight: "8px" }}
              />
              <span style={{ flex: 1 }}>{option.value}</span>
              <span style={{ color: "#666", fontSize: "12px" }}>({option.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Selected filters summary component
 */
function SelectedFilters({ onClearFilter }: { onClearFilter: (field: string, value: string) => void }) {
  const selectedFiltersCount = useSelectedFiltersCount()
  const { facets } = useFacets()

  const selectedFilters: Array<{ field: string; value: string; label: string }> = []

  facets.forEach(facet => {
    if (facet.type === "terms" && facet.data) {
      facet.data.forEach(option => {
        if (option.selected) {
          selectedFilters.push({
            field: facet.field,
            value: option.value,
            label: `${facet.name}: ${option.value}`
          })
        }
      })
    }
  })

  if (selectedFilters.length === 0) {
    return null
  }

  return (
    <div className="nosto-selected-filters" style={{ marginBottom: "16px" }}>
      <div style={{ fontWeight: "600", marginBottom: "8px" }}>Selected Filters ({selectedFiltersCount})</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {selectedFilters.map(filter => (
          <span
            key={`${filter.field}-${filter.value}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 8px",
              backgroundColor: "#e0e7ff",
              borderRadius: "16px",
              fontSize: "12px",
              gap: "4px"
            }}
          >
            {filter.label}
            <button
              onClick={() => onClearFilter(filter.field, filter.value)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                padding: "0",
                color: "#374151"
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * FiltersWrapper component that manages filter state
 */
function FiltersWrapper({ onFilterChange }: { onFilterChange: (detail: FilterChangeEventDetail) => void }) {
  const { facets } = useFacets()

  const handleClearFilter = useCallback(
    (field: string, value: string) => {
      onFilterChange({
        field,
        value,
        active: false
      })
    },
    [onFilterChange]
  )

  return (
    <div className="nosto-filters">
      <SelectedFilters onClearFilter={handleClearFilter} />

      <div className="nosto-filter-facets">
        {facets.map(facet =>
          facet.type === "terms" ? (
            <FilterFacet key={facet.field} facet={facet} onFilterChange={onFilterChange} />
          ) : null
        )}
      </div>
    </div>
  )
}

/**
 * NostoFilters Web Component
 *
 * Renders filter facets and selected filter summary.
 *
 * @example
 * ```html
 * <nosto-filters
 *   account-id="shopify-12345">
 * </nosto-filters>
 * ```
 */
export class NostoFilters extends NostoBaseElement {
  protected _render() {
    if (!this.shadowRoot) return

    const config = makeSerpConfig({
      defaultCurrency: this._config.defaultCurrency || "EUR",
      search: this._config.search
    })

    const handleFilterChange = (detail: FilterChangeEventDetail) => {
      this._dispatchNostoEvent(NOSTO_EVENTS.FILTER_CHANGE, detail)
    }

    render(
      <SearchPageProvider config={config}>
        <FiltersWrapper onFilterChange={handleFilterChange} />
      </SearchPageProvider>,
      this.shadowRoot
    )
  }
}
