import { nostojs } from "@nosto/nosto-js"
import { CurrencySettingsDTO } from "@nosto/nosto-js/client"

export type CurrencyFormats = Record<string, CurrencySettingsDTO>

const defaultConfig = {
  defaultCurrency: "EUR",
  defaultLocale: "en-US",
  /** @hidden  */
  currencySettings: {}
} satisfies CurrencyConfig

export interface CurrencyConfig {
  defaultCurrency: string
  defaultLocale: string
  currencySettings: CurrencyFormats
}

const currencyLocales: Record<string, string> = {
  EUR: "de-DE",
  GBP: "en-GB",
  USD: "en-US",
  AUD: "en-AU",
  CAD: "en-CA",
  //India, Afghanistan, Bangladesh, Bhutan, Myanmar, Nepal, and Pakistan uses lakhs and crores notation
  INR: "en-IN",
  AFN: "en-IN",
  BDT: "en-IN",
  BTN: "en-IN",
  MMK: "en-IN",
  NPR: "en-IN",
  PKR: "en-IN"
}

/**
 * Creates a currency formatting function with customizable settings.
 *
 * @param overrides - Optional configuration to override default currency settings.
 * @returns An object containing the formatCurrency function.
 *
 * @example
 * ```ts
 * import { getCurrencyFormatting } from '@nosto/search-js/currencies'
 *
 * // Use default settings from Nosto
 * const { formatCurrency } = getCurrencyFormatting()
 * console.log(formatCurrency(1234.56)) // Uses default currency
 * console.log(formatCurrency(1234.56, 'USD')) // "$1,234.56"
 * ```
 *
 * @example
 * ```ts
 * import { getCurrencyFormatting } from '@nosto/search-js/currencies'
 *
 * // Override with custom settings
 * const { formatCurrency } = getCurrencyFormatting({
 *   defaultCurrency: 'EUR',
 *   defaultLocale: 'de-DE',
 *   currencySettings: {
 *     EUR: {
 *       currencyBeforeAmount: false,
 *       currencyToken: '€',
 *       decimalCharacter: ',',
 *       groupingSeparator: '.',
 *       decimalPlaces: 2
 *     }
 *   }
 * })
 * console.log(formatCurrency(1234.56)) // "1.234,56€"
 * ```
 */
export function getCurrencyFormatting(overrides: Partial<CurrencyConfig> = {}) {
  const config: CurrencyConfig = {
    ...defaultConfig,
    ...overrides
  }
  if (!overrides.currencySettings) {
    nostojs(api => {
      config.currencySettings = api.internal.getSettings().currencySettings ?? {}
    })
  }

  /**
   * Format the given monetary value using the Nosto currency settings.
   */
  function formatCurrency(value: number, currency?: string) {
    const { defaultCurrency, currencySettings, defaultLocale } = config
    const currencyCode = currency ?? defaultCurrency
    const locale = currencyLocales[currencyCode] ?? defaultLocale

    if (currencyCode in currencySettings) {
      // formatting using Nosto settings
      const settings = currencySettings[currencyCode]!
      const result = new Intl.NumberFormat(locale, {
        useGrouping: !!settings.groupingSeparator,
        minimumFractionDigits: settings.decimalPlaces,
        maximumFractionDigits: settings.decimalPlaces
      }).formatToParts(value)

      const normalised = result
        .map(it => {
          if (it.type === "group") return settings.groupingSeparator
          if (it.type === "decimal") return settings.decimalCharacter
          return it.value
        })
        .join("")

      if (settings?.currencyBeforeAmount) {
        return `${settings.currencyToken}${normalised}`
      }
      return `${normalised}${settings?.currencyToken}`
    }

    // fallback logic
    const numberFormat = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode
    })
    return numberFormat.format(value)
  }

  return {
    formatCurrency
  }
}
