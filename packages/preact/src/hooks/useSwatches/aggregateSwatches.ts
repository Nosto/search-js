import { SearchProductSku } from "@nosto/nosto-js/client"
export interface SwatchOption {
  /**
   * The value of the swatch option (e.g., "Red", "L").
   */
  value: string
  /**
   * An array of full SKU objects associated with this option.
   */
  skus?: SearchProductSku[]
  /**
   * Indicates whether the option is unavailable.
   */
  unavailable?: boolean
  /**
   * Indicates whether the option is selected.
   */
  selected?: boolean
}

export interface SwatchField {
  /**
   * The name of the field (e.g., "color", "size").
   */
  field: string
  /**
   * An array of swatch options for this field.
   */
  options: SwatchOption[]
}

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
