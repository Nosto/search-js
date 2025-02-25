import { nostojs } from "@nosto/nosto-js"
import type { PersonalizationBoost } from "@nosto/nosto-js/client"
import { useEffect, useState } from "preact/hooks"

/**
 * Custom hook to fetch personalization data such as segments and boost.
 *
 * This hook uses the `nostojs` library to fetch search session parameters and updates
 * the state with the fetched segments and personalization boost.
 *
 * @returns An object containing:
 * - `segments`: An array of strings representing the personalization segments.
 * - `boost`: An array of `PersonalizationBoost` objects representing the personalization boost.
 *
 * @example
 * ```jsx
 * import { usePersonalization } from '@nosto/preact'
 *
 * export default () => {
 *   const { segments, boost } = usePersonalization()
 *
 *   return (
 *     <div>
 *       <h1>Personalization Segments</h1>
 *       <ul>
 *         {segments.map(segment => (
 *           <li key={segment}>{segment}</li>
 *         ))}
 *       </ul>
 *       <h1>Personalization Boost</h1>
 *       <ul>
 *         {boost.map(item => (
 *           <li key={item.id}>{item.name}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePersonalization() {
  const [segments, setSegments] = useState<string[]>([])
  const [boost, setBoost] = useState<PersonalizationBoost[]>([])

  useEffect(() => {
    nostojs(async api => {
      const { products, segments } = await api.getSearchSessionParams()
      setSegments(segments ?? [])
      setBoost(products?.personalizationBoost ?? [])
    })
  }, [])

  return {
    segments,
    boost
  }
}
