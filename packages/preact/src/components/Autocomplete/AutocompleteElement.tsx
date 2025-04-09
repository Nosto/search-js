import { nostojs } from "@nosto/nosto-js"
import { cloneElement, ComponentChildren } from "preact"

/**
 * @group Components
 */
export type AutocompleteElementProps = {
  /**
   * Rendered content.
   */
  children: ComponentChildren
  /**
   * Get product data for analytics
   */
  hit: {
    productId: string
    url?: string
    keyword?: string
  }
}

/**
 * Wraps elements to interactive component that handles selection based on provided configuration.
 *
 * @example
 * ```jsx
 * // Render product
 * {products?.hits?.map(hit => <AutocompleteElement hit={hit}>
 *     <a href={hit.url} class="nosto-product">
 *         <img src={hit.imageUrl} alt={hit.name} />
 *         <span>{hit.name}</span>
 *         <span>{hit.price}</span>
 *     </a>
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
export function AutocompleteElement({ children, hit }: AutocompleteElementProps) {
  if (!children || typeof children !== "object" || !("props" in children)) {
    throw new Error("AutocompleteElement expects a single valid VNode child element.")
  }

  const originalOnClick = children.props?.onClick

  return cloneElement(children, {
    onClick: (event: MouseEvent) => {
      if (hit) {
        nostojs(api => api.recordSearchClick("autocomplete", hit))
      }
      if (typeof originalOnClick === "function") {
        originalOnClick(event)
      }
    }
  })
}
