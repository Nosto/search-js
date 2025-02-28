import { getCurrencyFormatting } from "@currencies/getCurrencyFormatting"
import { useConfig } from "@preact/config/configContext"
import { useCallback, useMemo } from "preact/hooks"

/**
 * Preact hook that formats prices based on supplied currency with a fallback to the default currency.
 *
 * @example
 * ```jsx
 * import { useCurrencyFormatting } from '@nosto/preact'
 *
 * export default () => {
 *     const { format } = useCurrencyFormatting()
 *
 *     return (
 *
 *          <div class="product product-title">
 *               <span class="correct">
 *                   {product.name}
 *               </span>
 *           </div>
 *
 *           ...
 *
 *          <div class="product price product-price">
 *              <span>{format(product.listPrice, product.priceCurrencyCode || "EUR")}</span>
 *          </div>
 *     )
 * }
 * ```
 *
 * @group Hooks
 */
export function useCurrencyFormatting() {
  const { defaultCurrency } = useConfig()
  const currencyFormatting = useMemo(getCurrencyFormatting, [])

  const format = useCallback(
    (value: number, currency?: string) => {
      return currencyFormatting.formatCurrency(value, currency ?? defaultCurrency)
    },
    [currencyFormatting, defaultCurrency]
  )
  return { format }
}
