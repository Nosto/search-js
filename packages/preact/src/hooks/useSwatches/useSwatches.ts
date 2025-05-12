import { SearchProductSku } from "@nosto/nosto-js/client"
import { useCallback, useMemo, useState } from "preact/hooks"

import { aggregateSwatches } from "./aggregateSwatches"
import { filterSwatches } from "./filterSwatches"

/**
 * Preact hook for managing swatch options and selection.
 *
 * This hook aggregates SKU data by specified fields (e.g., "color", "size"),
 * generates swatch options, and manages the selection state for those options.
 *
 * @example
 * ```jsx
 * import { useSwatches } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *   const { swatches, toggleOption } = useSwatches(skus, ["color", "size"])
 *
 *   return (
 *     <div>
 *       {swatches.map(({ field, options }) => (
 *         <div key={field}>
 *           {options.map(({ value, unavailable, selected }) => (
 *             <button
 *               key={value}
 *               disabled={unavailable}
 *               onClick={() => toggleOption(field, value)}
 *               style={{
 *                 background: selected ? "#0070f3" : "transparent",
 *                 color: selected ? "#fff" : "#000",
 *               }}
 *             >
 *               {value}
 *             </button>
 *           ))}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 *
 * @group Hooks
 */
export function useSwatches(skus: SearchProductSku[] = [], fields: string[] = []) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const swatches = useMemo(() => {
    return filterSwatches(aggregateSwatches(skus, fields), selectedOptions)
  }, [skus, fields, selectedOptions])

  const toggleOption = useCallback((field: string, value: string) => {
    setSelectedOptions(prev => {
      const newOptions = { ...prev }
      if (newOptions[field] === value) {
        delete newOptions[field]
      } else {
        newOptions[field] = value
      }
      return newOptions
    })
  }, [])

  return { swatches, toggleOption }
}
