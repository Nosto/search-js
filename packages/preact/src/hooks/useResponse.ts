import type { SearchKeywords, SearchProducts } from "@nosto/nosto-js/client"

import { useNostoAppState } from "./useNostoAppState"

/**
 * Preact hook that imports response data to the component.
 * @example
 * ```jsx
 * import { useResponse } from '@nosto/search-js/preact'
 * import { defaultConfig } from "../config"
 *
 * export default () => {
 *   const { products, keywords } = useResponse()
 *   return (
 *     <div>
 *       <div>
 *         {keywords.hits.length > 0 && (
 *           <div>
 *             <div>
 *               Keywords
 *             </div>
 *             <div>
 *               <Keywords
 *                 hits={keywords.hits}
 *                 keywordComponent={Keyword}
 *                 elementComponent={Element}
 *                 keywordInCategoryComponent={KeywordInCategory}
 *               />
 *             </div>
 *             {!products.hits.length && <SubmitButton />}
 *           </div>
 *         )}
 *         {products.hits.length > 0 && (
 *           <div>
 *             <div>
 *               Products
 *             </div>
 *             <div>
 *               {products.hits.map(hit => {
 *                 return (
 *                   <AutocompleteElement hit={hit}>
 *                     <div
 *                       data-url={hit.url}
 *                       data-nosto-element="product"
 *                     >
 *                       <img
 *                         src={hit.imageUrl ?? productImagePlaceholder}
 *                         alt={hit.name}
 *                       />
 *                       <div>
 *                         {hit.brand && (
 *                           <div>{hit.brand}</div>
 *                         )}
 *                         <div>
 *                           {hit.name}
 *                         </div>
 *                         <div>
 *                           <span>{formatCurrency(hit.price)}</span>
 *                           {hit.listPrice && hit.listPrice > hit.price && (
 *                             <span>
 *                               {formatCurrency(hit.listPrice)}
 *                             </span>
 *                           )}
 *                         </div>
 *                       </div>
 *                     </div>
 *                   </AutocompleteElement>
 *                 )
 *               })}
 *             </div>
 *             <SubmitButton />
 *           </div>
 *         )}
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 * @group Hooks
 *
 */
export function useResponse(): { products: SearchProducts; keywords: SearchKeywords } {
  const { products, keywords } = useNostoAppState(state => state.response)
  return {
    /** Array of products */
    products: products ?? { hits: [], total: 0 },
    /** Array of keywords */
    keywords: keywords ?? { hits: [], total: 0 }
  }
}
