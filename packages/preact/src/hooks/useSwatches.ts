import { useCallback, useMemo, useState } from "preact/hooks"

/**
 * SKU type representing a product variant.
 */
export interface SKU {
  /** Unique identifier for the SKU. */
  id: string
  /** Array of custom fields associated with this SKU (e.g., color, size). */
  customFields: { key: string; value: string }[]
}

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
 * Result type for the useSwatches hook.
 */
export interface UseSwatchesResult {
  /** Array of swatch fields with their options. */
  swatches: SwatchField[]
  /** Object representing the currently selected options (field-value pairs). */
  selectedOptions: Record<string, string>
  /** Function to toggle a swatch option (select or deselect). */
  toggleOption: (field: string, value: string) => void
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
 *           {options.map(option => (
 *             <button
 *               key={option.value}
 *               disabled={option.unavailable}
 *               onClick={() => toggleOption(field, option.value)}
 *             >
 *               {option.value}
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
export function useSwatches(items: SKU[] = [], fields: string[] = []): UseSwatchesResult {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const swatches = useMemo(() => {
    if (!items.length || !fields.length) return []

    const aggregated: Record<string, Record<string, string[]>> = {}

    items.forEach(item => {
      const fieldValues = item.customFields.reduce(
        (acc, field) => {
          acc[field.key.toLowerCase()] = field.value
          return acc
        },
        {} as Record<string, string>
      )

      fields.forEach(field => {
        const value = fieldValues[field.toLowerCase()]
        if (!value) return

        if (!aggregated[field]) aggregated[field] = {}
        if (!aggregated[field][value]) aggregated[field][value] = []
        aggregated[field][value].push(item.id)
      })
    })

    return Object.entries(aggregated).map(([field, values]) => ({
      field,
      options: Object.entries(values).map(([value, skuList]) => ({
        value,
        skus: skuList,
        unavailable: false
      }))
    }))
  }, [items, fields])

  const filteredSwatches = useMemo(() => {
    if (!swatches || swatches.length === 0) {
      return []
    }

    return swatches.map(({ field, options }) => ({
      field,
      options: options.map(option => ({
        ...option,
        unavailable: Object.entries(selectedOptions).some(
          ([selectedField, selectedValue]) =>
            selectedField !== field &&
            !option.skus.some(
              sku =>
                selectedValue &&
                swatches
                  .find(sw => sw.field === selectedField)
                  ?.options.some(opt => opt.value === selectedValue && opt.skus.includes(sku))
            )
        )
      }))
    }))
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
