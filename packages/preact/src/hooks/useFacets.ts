import { useNostoAppState } from "./useNostoAppState"

/**
 * Preact hook that import facets to the component.
 * @example
 * ```jsx
 * import { useFacets } from '@nosto/search-js/preact'
 * import { defaultConfig } from "../config"
 *
 * export default () => {
 *   const { loading, facets } = useFacets()
 *
 *   return (
 *     <div style={loading ? "opacity: 0.3;" : ""}>
 *       <div>
 *         <ul>
 *           {facets.map(facet => {
 *             switch (facet.type) {
 *               case "terms":
 *                 return <Facet facet={facet} />
 *               case "stats":
 *                 return <RangeFacet facet={facet} />
 *               default:
 *                 return null
 *             }
 *           })}
 *         </ul>
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 * @group Hooks
 *
 */
export function useFacets() {
  const { loading, facets } = useNostoAppState(state => ({
    loading: state.loading,
    facets: state.response?.products?.facets ?? []
  }))

  return {
    /** Loading state */
    loading,
    /** Array of facets*/
    facets
  }
}
