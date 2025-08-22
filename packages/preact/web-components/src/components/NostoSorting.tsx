import { SortOption, useSort } from "@preact/hooks/useSort/useSort"
import { makeSerpConfig } from "@preact/serp/SerpConfig"
import { SearchPageProvider } from "@preact/serp/SerpPageProvider"
import { render } from "preact"
import { useCallback } from "preact/hooks"

import { NOSTO_EVENTS, SortChangeEventDetail } from "../types"
import { NostoBaseElement } from "./NostoBaseElement.tsx"

/**
 * Default sort options
 */
const defaultSortOptions: SortOption[] = [
  {
    id: "relevance",
    value: {
      name: "Relevance",
      sort: []
    }
  },
  {
    id: "price-asc",
    value: {
      name: "Price: Low to High",
      sort: [{ field: "price", order: "asc" }]
    }
  },
  {
    id: "price-desc",
    value: {
      name: "Price: High to Low",
      sort: [{ field: "price", order: "desc" }]
    }
  },
  {
    id: "name-asc",
    value: {
      name: "Name: A to Z",
      sort: [{ field: "name", order: "asc" }]
    }
  },
  {
    id: "name-desc",
    value: {
      name: "Name: Z to A",
      sort: [{ field: "name", order: "desc" }]
    }
  }
]

/**
 * SortingWrapper component that manages sorting state
 */
function SortingWrapper({
  sortOptions = defaultSortOptions,
  onSortChange
}: {
  sortOptions?: SortOption[]
  onSortChange: (detail: SortChangeEventDetail) => void
}) {
  const { activeSort, setSort } = useSort(sortOptions)

  const handleSortChange = useCallback(
    (event: Event) => {
      const target = event.target as HTMLSelectElement
      const sortId = target.value
      setSort(sortId)
      onSortChange({ sort: sortId })
    },
    [setSort, onSortChange]
  )

  return (
    <div className="nosto-sorting">
      <label
        htmlFor="nosto-sort-select"
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          fontSize: "14px"
        }}
      >
        Sort by:
      </label>
      <select
        id="nosto-sort-select"
        value={activeSort}
        onChange={handleSortChange}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          backgroundColor: "white",
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        {sortOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.value.name}
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * NostoSorting Web Component
 *
 * Renders a sorting dropdown for search results.
 *
 * @example
 * ```html
 * <nosto-sorting
 *   account-id="shopify-12345"
 *   sort-options='[{"id":"relevance","name":"Relevance"},{"id":"price-asc","name":"Price: Low to High"}]'>
 * </nosto-sorting>
 * ```
 */
export class NostoSorting extends NostoBaseElement {
  protected _render() {
    const config = makeSerpConfig({
      defaultCurrency: this._config.defaultCurrency || "EUR",
      search: this._config.search
    })

    // Parse custom sort options from attributes
    let sortOptions = defaultSortOptions
    const customSortOptions = this.getAttribute("sort-options")
    if (customSortOptions) {
      try {
        const parsed = JSON.parse(customSortOptions)
        if (Array.isArray(parsed)) {
          sortOptions = parsed.map(
            (option: { id: string; name: string; sort?: unknown; field?: string; order?: string }) => ({
              id: option.id,
              value: {
                name: option.name,
                sort: Array.isArray(option.sort)
                  ? option.sort
                  : option.id === "relevance"
                    ? []
                    : [{ field: option.field || "price", order: (option.order || "asc") as "asc" | "desc" }]
              }
            })
          )
        }
      } catch (e) {
        console.warn("Invalid sort-options JSON:", e)
      }
    }

    const handleSortChange = (detail: SortChangeEventDetail) => {
      this._dispatchNostoEvent(NOSTO_EVENTS.SORT_CHANGE, detail)
    }

    render(
      <SearchPageProvider config={config}>
        <SortingWrapper sortOptions={sortOptions} onSortChange={handleSortChange} />
      </SearchPageProvider>,
      this
    )
  }

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, "sort-options"]
  }
}
