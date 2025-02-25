import { SearchProduct, SearchProductSku } from "@nosto/nosto-js/client"

import { CurrencyConfig, getCurrencyFormatting } from "./getCurrencyFormatting"

type Prices = Pick<SearchProduct, "price" | "listPrice">

export type FormattedPrices = {
  priceText?: string
  listPriceText?: string
}

export type Result = SearchProduct &
  FormattedPrices & {
    skus?: (SearchProductSku & FormattedPrices)[]
  }

/**
 * Exposes currency formatting logic as a SearchProduct decorator
 * Sets priceText and listPriceText fields on product and SKU level
 * Requires price, listPrice and priceCurrencyCode fields to be present
 */
export function priceDecorator(config?: Partial<CurrencyConfig>) {
  const { formatCurrency } = getCurrencyFormatting(config)

  function formatPrices<T extends Prices>(obj: T, currency?: string) {
    const formatted: FormattedPrices = {}
    if (obj.price !== undefined) {
      formatted.priceText = formatCurrency(obj.price, currency)
    }
    if (obj.listPrice !== undefined) {
      formatted.listPriceText = formatCurrency(obj.listPrice, currency)
    }
    return Object.assign({}, obj, formatted)
  }

  function hasPrices(obj: Prices) {
    return obj.price !== undefined || obj.listPrice !== undefined
  }

  return function decorator(hit: SearchProduct): Result {
    if (!hasPrices(hit)) {
      return hit
    }
    const copy = formatPrices(hit, hit.priceCurrencyCode)
    if (copy.skus && copy.skus.some(hasPrices)) {
      copy.skus = copy.skus.map(sku => {
        return !hasPrices(sku) ? sku : formatPrices(sku, hit.priceCurrencyCode)
      })
    }
    return copy
  }
}
