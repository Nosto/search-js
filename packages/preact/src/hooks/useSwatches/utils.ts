import { SearchProductSku } from "@nosto/nosto-js/client"

export type SKU = Pick<SearchProductSku, "id" | "customFields">

export interface SwatchOption {
  value: string
  skus: string[]
  unavailable?: boolean
  selected?: boolean
}

export interface SwatchField {
  field: string
  options: SwatchOption[]
}

export function aggregateSwatches(skus: SKU[], fields: string[]): SwatchField[] {
  if (!skus.length || !fields.length) return []

  const aggregated = fields.reduce<Record<string, Record<string, string[]>>>((acc, field) => {
    acc[field] = {}
    return acc
  }, {})

  skus.forEach(({ id, customFields }) => {
    customFields?.forEach(({ key, value }) => {
      const field = key.toLowerCase()
      if (fields.includes(field)) {
        aggregated[field][value] = aggregated[field][value] || []
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
}

export function filterSwatches(swatches: SwatchField[], selectedOptions: Record<string, string>): SwatchField[] {
  if (!swatches.length) return []

  return swatches.map(({ field, options }) => ({
    field,
    options: options.map(option => {
      const isUnavailable = !option.skus.some(sku =>
        Object.entries(selectedOptions).every(([selectedField, selectedValue]) => {
          if (selectedField === field) return true
          const matchingSwatch = swatches.find(sw => sw.field === selectedField)
          return matchingSwatch?.options.some(opt => opt.value === selectedValue && opt.skus.includes(sku))
        })
      )

      const isSelected = selectedOptions[field] === option.value

      return {
        ...option,
        unavailable: isUnavailable,
        selected: isSelected
      }
    })
  }))
}
