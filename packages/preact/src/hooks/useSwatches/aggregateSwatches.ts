import { SearchProductSku } from "@nosto/nosto-js/client"

export type SKU = Pick<SearchProductSku, "id" | "customFields">

export interface SwatchOption {
  /**
   * The value of the swatch option (e.g., "Red", "L").
   */
  value: string
  /**
   * An array of SKU IDs associated with this option.
   */
  skus: string[]
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
