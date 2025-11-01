import type { SearchCategories, SearchKeywords, SearchPopularSearches, SearchProducts } from "@nosto/nosto-js/client"

import { useNostoAppState } from "./useNostoAppState"

/**
 * Preact hook that imports response data to the component.
 * @example
 * ```jsx
 * import { useResponse } from '@nosto/search-js/preact/hooks'
 * import { defaultConfig } from "../config"
 *
 * export default () => {
 *   const { products, keywords, popularSearches, categories } = useResponse()
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
 *         {popularSearches.hits.length > 0 && (
 *           <div>
 *             <div>
 *               Popular Searches
 *             </div>
 *             <div>
 *               {popularSearches.hits.map(hit => (
 *                 <div key={hit.query}>
 *                   {hit.query} ({hit.total} results)
 *                 </div>
 *               ))}
 *             </div>
 *           </div>
 *         )}
 *         {categories.hits.length > 0 && (
 *           <div>
 *             <div>
 *               Categories
 *             </div>
 *             <div>
 *               {categories.hits.map(hit => (
 *                 <div key={hit.externalId}>
 *                   {hit.name}
 *                 </div>
 *               ))}
 *             </div>
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
export function useResponse(): {
  products: SearchProducts
  keywords: SearchKeywords
  popularSearches: SearchPopularSearches
  categories: SearchCategories
} {
  const { products, keywords, popularSearches, categories } = useNostoAppState(state => ({
    products: state.response.products ?? defaultValue,
    keywords: state.response.keywords ?? defaultValue,
    popularSearches: state.response.popularSearches ?? defaultValue,
    categories: state.response.categories ?? defaultValue
  }))
  return {
    /** Array of products */
    products,
    /** Array of keywords */
    keywords,
    /** Array of popular searches */
    popularSearches,
    /** Array of categories */
    categories
  }
}

const defaultValue = { hits: [], total: 0 }
