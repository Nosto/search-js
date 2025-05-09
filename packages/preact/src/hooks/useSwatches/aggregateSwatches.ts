import { SearchProductSku } from "@nosto/nosto-js/client"

import { SwatchField } from "../types"

export function aggregateSwatches(skus: SearchProductSku[], fields: string[]): SwatchField[] {
  if (!skus.length || !fields.length) return []

  const aggregated = fields.reduce<Record<string, Record<string, SearchProductSku[]>>>((acc, field) => {
    acc[field] = {}
    return acc
  }, {})

  skus.forEach(sku => {
    sku.customFields?.forEach(({ key, value }) => {
      const field = key.toLowerCase()
      if (fields.includes(field)) {
        aggregated[field][value] = aggregated[field][value] || []
        aggregated[field][value].push(sku)
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
