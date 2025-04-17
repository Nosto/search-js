import { priceDecorator } from "@nosto/search-js/currencies"
import { AutocompleteConfig, AutocompletePageProvider } from "@nosto/search-js/preact/autocomplete"
import { thumbnailDecorator } from "@nosto/search-js/thumbnails"

import { Content } from "./Content"

export const hitDecorators = [thumbnailDecorator({ size: "5" }), priceDecorator({ defaultCurrency: "EUR" })] as const

export function Autocomplete() {
  const config = {
    defaultCurrency: "EUR",
    search: {
      hitDecorators
    }
  } satisfies AutocompleteConfig

  return (
    <>
      <AutocompletePageProvider config={config}>
        <Content />
      </AutocompletePageProvider>
    </>
  )
}
