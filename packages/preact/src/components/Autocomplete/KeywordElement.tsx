import { AsComponent, BaseElement, BaseElementProps } from "./BaseElement"

/**
 * @group Components
 */
export type KeywordElementProps = Omit<BaseElementProps<AsComponent>, "hit"> & {
  hit: {
    keyword: string
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
export const KeywordElement = (props: KeywordElementProps) => BaseElement(props)
