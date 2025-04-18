import { nostojs } from "@nosto/nosto-js"
import { cloneElement, ComponentChildren } from "preact"

import { isValidHTMLElement } from "./utils"

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
 * ```
 *
 * @group Components
 */
export function AutocompleteElement({ children, hit }: AutocompleteElementProps) {
  if (!isValidHTMLElement(children)) {
    throw new Error(
      "AutocompleteElement expects a single valid HTML element as its child (e.g., <div>, <a>). Custom components are not supported."
    )
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
