import { nostojs } from "@nosto/nosto-js"
import { SearchQuery } from "@nosto/nosto-js/client"
import { renderHeadless } from "@preact/dom/renderHeadless"
import { ComponentChildren } from "preact"

/**
 * @group Components
 */
export type AutocompleteElementProps = {
  /**
   * Rendered content.
   */
  children: ComponentChildren
  /**
   * Execute new search with specified query on the selection
   */
  query?: SearchQuery
  /**
   * Get product data for analytics
   */
  hit: {
    productId: string
    url?: string
    keyword?: string
  }
  /**
   * Handle click event
   */
  onClick?: (event: Event) => void
}

/**
 * Wraps elements to interactive component that handles selection based on provided configuration.
 *
 * @example
 * ```jsx
 * // Render product
 * {products?.hits?.map(hit => <AutocompleteElement hit={hit} class="nosto-product">
 *     {hit.title}
 * </AutocompleteElement>)}
 *
 * // Render keywords
 * {keywords?.hits?.map(hit => <AutocompleteElement query={{ query: hit.keywords }} class="nosto-keyword">
 *     {hit.keywords}
 * </AutocompleteElement>)}
 * ```
 *
 * @group Components
 */
export function AutocompleteElement({ children, hit, onClick }: AutocompleteElementProps) {
  return renderHeadless({
    children,
    updateElement: (vnode, ctx) => {
      if (ctx.depth > 0) {
        return vnode
      }

      vnode.props = {
        ...vnode.props,
        onClick: (event: MouseEvent) => {
          if (hit) {
            nostojs(api => api.recordSearchClick("autocomplete", hit))
          }
          if (typeof onClick === "function") {
            onClick(event)
          }
        }
      }
      return vnode
    }
  })
}
