import { NostoAutocomplete } from "./components/NostoAutocomplete.tsx"
import { NostoFilters } from "./components/NostoFilters.tsx"
import { NostoResults } from "./components/NostoResults.tsx"
import { NostoSorting } from "./components/NostoSorting.tsx"
import { NostoPagination } from "./components/NostoPagination.tsx"

/**
 * Register all Nosto web components with the browser's custom element registry.
 * 
 * This function should be called once to make the components available for use in HTML.
 * 
 * @example
 * ```typescript
 * import { registerNostoElements } from '@nosto/search-js/preact/web-components'
 * 
 * // Register all components
 * registerNostoElements()
 * 
 * // Now you can use them in HTML:
 * // <nosto-autocomplete account-id="shopify-12345"></nosto-autocomplete>
 * // <nosto-results account-id="shopify-12345"></nosto-results>
 * ```
 */
export function registerNostoElements() {
  // Check if custom elements are supported
  if (typeof customElements === "undefined") {
    console.warn("Custom Elements are not supported in this browser")
    return
  }

  // Register each component if not already registered
  const components = [
    { name: "nosto-autocomplete", constructor: NostoAutocomplete },
    { name: "nosto-filters", constructor: NostoFilters },
    { name: "nosto-results", constructor: NostoResults },
    { name: "nosto-sorting", constructor: NostoSorting },
    { name: "nosto-pagination", constructor: NostoPagination }
  ]

  components.forEach(({ name, constructor }) => {
    if (!customElements.get(name)) {
      customElements.define(name, constructor)
    } else {
      console.warn(`Custom element '${name}' is already registered`)
    }
  })
}

/**
 * Register individual Nosto web components.
 * Use this if you only want to register specific components.
 */
export const registerComponents = {
  /**
   * Register the NostoAutocomplete component
   */
  autocomplete() {
    if (typeof customElements !== "undefined" && !customElements.get("nosto-autocomplete")) {
      customElements.define("nosto-autocomplete", NostoAutocomplete)
    }
  },

  /**
   * Register the NostoFilters component  
   */
  filters() {
    if (typeof customElements !== "undefined" && !customElements.get("nosto-filters")) {
      customElements.define("nosto-filters", NostoFilters)
    }
  },

  /**
   * Register the NostoResults component
   */
  results() {
    if (typeof customElements !== "undefined" && !customElements.get("nosto-results")) {
      customElements.define("nosto-results", NostoResults)
    }
  },

  /**
   * Register the NostoSorting component
   */
  sorting() {
    if (typeof customElements !== "undefined" && !customElements.get("nosto-sorting")) {
      customElements.define("nosto-sorting", NostoSorting)
    }
  },

  /**
   * Register the NostoPagination component
   */
  pagination() {
    if (typeof customElements !== "undefined" && !customElements.get("nosto-pagination")) {
      customElements.define("nosto-pagination", NostoPagination)
    }
  }
}