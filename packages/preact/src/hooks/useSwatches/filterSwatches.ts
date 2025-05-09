import { SwatchField } from "./aggregateSwatches"

export function filterSwatches(swatches: SwatchField[], selectedOptions: Record<string, string>): SwatchField[] {
  if (!swatches.length) return []

  return swatches.map(({ field, options }) => ({
    field,
    options: options.map(option => {
      const unavailable = !option.skus.some(sku =>
        Object.entries(selectedOptions).every(([selectedField, selectedValue]) => {
          if (selectedField === field) return true
          const matchingSwatch = swatches.find(sw => sw.field === selectedField)
          return matchingSwatch?.options.some(opt => opt.value === selectedValue && opt.skus.includes(sku))
        })
      )

      const selected = selectedOptions[field] === option.value

      return {
        ...option,
        unavailable,
        selected
      }
    })
  }))
}
