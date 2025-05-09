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
