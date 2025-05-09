import { SearchProductSku } from "@nosto/nosto-js/client"
import { useCallback, useMemo, useState } from "preact/hooks"

/**
 * SKU type representing a product variant.
 */
export type SKU = Pick<SearchProductSku, "id" | "customFields">

/**
 * SwatchOption type representing a selectable swatch value.
 */
export interface SwatchOption {
  /** The value of the swatch option (e.g., "Red", "L"). */
  value: string
  /** Array of SKU IDs that match this swatch option. */
  skus: string[]
  /** Indicates if this swatch option is unavailable based on selected options. */
  unavailable?: boolean
  /** Indicates if this swatch option is selected. */
  selected?: boolean
}

/**
 * SwatchField type representing a group of swatch options.
 */
export interface SwatchField {
  /** The name of the field (e.g., "color", "size"). */
  field: string
  /** Array of swatch options for this field. */
  options: SwatchOption[]
}

/**
 * Preact hook for managing swatch options and selection.
 *
 * This hook aggregates SKU data by specified fields (e.g., "color", "size"),
 * generates swatch options, and manages the selection state for those options.
 *
 * @example
 * ```tsx
 * import { useSwatches } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *   const { swatches, selectedOptions, toggleOption } = useSwatches(skus, ["color", "size"])
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
export function useSwatches(skus: SKU[] = [], fields: string[] = []) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const swatches = useMemo(() => {
    if (!skus.length || !fields.length) return []

    const aggregated = fields.reduce(
      (acc, field) => {
        acc[field] = {}
        return acc
      },
      {} as Record<string, Record<string, string[]>>
    )

    skus.forEach(({ id, customFields }) => {
      customFields?.forEach(({ key, value }) => {
        const field = key.toLowerCase()
        if (fields.includes(field)) {
          if (!aggregated[field][value]) {
            aggregated[field][value] = []
          }
          if (id) {
            aggregated[field][value].push(id)
          }
        }
      })
    })

    return Object.entries(aggregated).map(([field, values]) => ({
      field,
      options: Object.entries(values).map(([value, skus]) => ({
        value,
        skus,
        unavailable: false,
        selected: false
      }))
    }))
  }, [skus, fields])

  const filteredSwatches = useMemo(() => {
    if (!swatches.length) return []

    return swatches.map(({ field, options }) => {
      return {
        field,
        options: options.map(option => {
          const isUnavailable = selectedOptions
            ? !option.skus.some(sku =>
                Object.entries(selectedOptions).every(([selectedField, selectedValue]) => {
                  if (selectedField === field) return true
                  const matchingSwatch = swatches.find(sw => sw.field === selectedField)
                  return matchingSwatch?.options.some(opt => opt.value === selectedValue && opt.skus.includes(sku))
                })
              )
            : false

          const isSelected = selectedOptions[field] === option.value

          return {
            ...option,
            unavailable: isUnavailable,
            selected: isSelected
          }
        })
      }
    })
  }, [swatches, selectedOptions])

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

  return { swatches: filteredSwatches, selectedOptions, toggleOption }
}
