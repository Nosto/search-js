import { nostojs } from "@nosto/nosto-js"
import { SearchKeyword, SearchProduct } from "@nosto/nosto-js/client"
import { AutocompletePageProvider } from "@preact/autocomplete/AutocompletePageProvider"
import { Store } from "@preact/common/store/store"
import { disableNativeAutocomplete } from "@utils/bindInput"
import { measure } from "@utils/performance"
import { getLocalStorageItem, setLocalStorageItem } from "@utils/storage"
import { render } from "preact"

import ErrorBoundary from "../components/ErrorBoundary"
import { AutocompleteInjectConfig } from "../config"
import { bindBlur, bindClickOutside } from "../helpers/dom"
import { CssSelector, resolveCssSelector } from "../resolveCssSelector"
import { waitForElements } from "../wait"
import { AutocompleteContext } from "./autocomplete/AutocompleteContext"
import { bindAutocompleteInput } from "./autocomplete/bindAutocompleteInput"
import { createElements } from "./autocomplete/createElements"

export async function injectAutocomplete(config: AutocompleteInjectConfig, store: Store) {
  const { inputCssSelector, timeout } = config
  const selector = resolveCssSelector(inputCssSelector).selector
  const inputs = await waitForElements<HTMLInputElement>({
    selector,
    timeout
  })

  if (inputs.length === 0) {
    throw new Error(`No elements found for selector: ${selector}`)
  }

  inputs.forEach(input => {
    injectAutocompleteForInput(input, config, store)
  })
}

async function injectAutocompleteForInput(
  input: HTMLInputElement,
  injectConfig: AutocompleteInjectConfig,
  store: Store
) {
  const { config, dropdownCssSelector, renderSpeechToText, renderAutocomplete } = injectConfig
  const dropdown = createDropdown(input, dropdownCssSelector)
  const history = createHistory(input, dropdownCssSelector, config.historySize)
  const hasSpeechToTextAlready = !!input.parentElement?.querySelector(".ns-autocomplete-voice-position")

  if (renderSpeechToText && !hasSpeechToTextAlready) {
    const locationHelperElement = document.createElement("div")
    locationHelperElement.className = "ns-autocomplete-voice-position"
    input.insertAdjacentElement("afterend", locationHelperElement)

    const speechToText = await renderSpeechToText()
    render(
      <ErrorBoundary>
        <AutocompletePageProvider config={config} store={store}>
          {speechToText}
        </AutocompletePageProvider>
      </ErrorBoundary>,
      locationHelperElement
    )
  }

  const storeHistoryState = () => {
    store.updateState({
      historyItems: history.get()
    })
  }

  input.setAttribute("data-nosto-element", "search-input")
  storeHistoryState()

  const onReportClick = (query: string, isKeyword: boolean) => {
    dropdown.hide()
    history.hide()
    if (!query) {
      return
    }

    history.add(query)
    storeHistoryState()
    if (isKeyword) {
      nostojs(api => api.recordSearchSubmit(query))
      input.value = query
    }
  }

  const onReportProductClick = (product: SearchProduct) => {
    onReportClick(product.name!, false)
  }

  const onReportKeywordClick = (keyword: SearchKeyword) => {
    onReportClick(keyword.keyword, true)
  }

  disableNativeAutocomplete(input)

  store.onChange(
    state => state.initialized,
    initialized => {
      if (!initialized || !renderAutocomplete) {
        return
      }

      const end = measure("renderAutocomplete")

      render(
        <ErrorBoundary>
          <AutocompletePageProvider config={config} store={store}>
            <AutocompleteContext
              value={{ reportProductClick: onReportProductClick, reportKeywordClick: onReportKeywordClick }}
            >
              {renderAutocomplete()}
            </AutocompleteContext>
          </AutocompletePageProvider>
        </ErrorBoundary>,
        dropdown.element
      )
      end()
    }
  )

  const outsideDropdown = bindClickOutside([dropdown.element, input], () => {
    dropdown.hide()
  })
  const outsideHistory = bindClickOutside([history.element, input], () => {
    history.hide()
  })

  bindBlur(history.element, history.hide)
  bindBlur(dropdown.element, dropdown.hide)

  // Keep last
  const bind = bindAutocompleteInput(input, history, dropdown, injectConfig, store)

  return {
    destroy() {
      bind.destroy()
      dropdown.destroy()
      history.destroy()
      outsideDropdown.destroy()
      outsideHistory.destroy()
    }
  }
}

export type AutocompleteHistory = ReturnType<typeof createHistory>
export type AutocompleteDropdown = ReturnType<typeof createDropdown>

function createDropdown(input: HTMLInputElement, dropdownSelector: CssSelector) {
  const dropdown = document.createElement("div")
  dropdown.className = "nosto-autocomplete-dropdown"
  const base = createElements(input, dropdown, dropdownSelector)

  return {
    ...base,
    element: dropdown
  }
}

const historyKey = "nosto:search-js:history"

function createHistory(input: HTMLInputElement, dropdownSelector: CssSelector, historySize: number) {
  const dropdown = document.createElement("div")
  dropdown.className = "nosto-autocomplete-history"
  const base = createElements(input, dropdown, dropdownSelector)

  return {
    ...base,
    element: dropdown,
    add: (value: string) => {
      const allItems = getLocalStorageItem<string[]>(historyKey) || []
      const filteredItems = allItems.filter(v => v !== value).slice(historySize ? -historySize : 0)
      filteredItems.push(value)
      setLocalStorageItem(historyKey, filteredItems)
    },
    get: () => {
      const historyFromLocalStorage = getLocalStorageItem<string[]>(historyKey) || []
      const historyItems = historyFromLocalStorage
        ? historyFromLocalStorage.reverse().filter((c: string) => !!c)
        : undefined

      return historyItems
    }
  }
}
