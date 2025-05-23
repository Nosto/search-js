import { SearchProductSku } from "@nosto/nosto-js/client"
import { useCallback, useMemo, useState } from "preact/hooks"

import { aggregateSwatches } from "./aggregateSwatches"
import { applySelectionStates } from "./applySelectionStates"
import { sortOptions } from "./sortOptions"

/**
 * Preact hook for managing swatch options and selection.
 *
 * This hook aggregates SKU data by specified fields (e.g., "color", "size"),
 * generates swatch options, and manages the selection state for those options.
 *
 *  * Use `matchedSkus` to:
 * - Display preview data like images or prices from partial selections.
 * - Enable actions like "Add to Cart" when exactly one matching SKU remains.
 *
 * @example
 * ```jsx
 * import { useSwatches } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *   const { swatches, toggleOption, matchedSkus } = useSwatches(skus, ["color", "size"])
 *
 *   const canAddToCart = matchedSkus.length === 1
 *   const previewImage = matchedSkus[0]?.imageUrl || "/fallback.jpg"
 *
 *   return (
 *     <div>
 *       <img src={previewImage} alt="Product preview" width={200} />
 *
 *       {swatches.map(({ field, options }) => (
 *         <div key={field}>
 *           {options.map(({ value, unavailable, selected }) => (
 *             <button
 *               key={value}
 *               disabled={unavailable}
 *               onClick={() => toggleOption(field, value)}
 *               style={{
 *                 margin: "4px",
 *                 padding: "8px 12px",
 *                 background: selected ? "#0070f3" : "#eee",
 *                 color: selected ? "#fff" : "#000",
 *                 opacity: unavailable ? 0.3 : 1
 *               }}
 *             >
 *               {value}
 *             </button>
 *           ))}
 *         </div>
 *       ))}
 *
 *       <button disabled={!canAddToCart}>
 *         Add to Cart
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @group Hooks
 */
export function useSwatches(skus: SearchProductSku[] = [], fields: string[] = []) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const aggregatedAndSorted = useMemo(() => {
    const raw = aggregateSwatches(skus, fields)
    return raw.map(({ field, options }) => ({
      field,
      options: sortOptions(field, options)
    }))
  }, [skus, fields])

  const swatches = useMemo(() => {
    return applySelectionStates(aggregatedAndSorted, selectedOptions)
  }, [aggregatedAndSorted, selectedOptions])

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

  const matchedSkus = useMemo(() => {
    const selectedFields = Object.keys(selectedOptions).filter(f => selectedOptions[f])

    if (selectedFields.length === 0) return []

    const matchedLists: SearchProductSku[][] = swatches
      .filter(({ field }) => selectedOptions[field])
      .map(({ field, options }) => {
        const selectedValue = selectedOptions[field]
        const option = options.find(opt => opt.value === selectedValue)
        return option?.skus ?? []
      })

    return matchedLists.reduce((acc, list) => acc.filter(sku => list.includes(sku)))
  }, [swatches, selectedOptions])

  return { swatches, toggleOption, matchedSkus }
}
