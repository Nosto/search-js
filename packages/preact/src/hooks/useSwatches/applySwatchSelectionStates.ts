import { SwatchField } from "../types"

export function applySwatchSelectionStates(
  swatches: SwatchField[],
  selectedOptions: Record<string, string>
): SwatchField[] {
  if (!swatches.length) return []

  return swatches.map(({ field, options }) => ({
    field,
    options: options.map(option => {
      const unavailable = !option.skus?.some(sku => {
        return Object.entries(selectedOptions).every(([selectedField, selectedValue]) => {
          if (selectedField === field) return true
          const skuFieldValue = sku.customFields?.find(field => field.key.toLowerCase() === selectedField)?.value
          return skuFieldValue === selectedValue
        })
      })

      const selected = selectedOptions[field] === option.value

      return {
        ...option,
        unavailable,
        selected
      }
    })
  }))
}
