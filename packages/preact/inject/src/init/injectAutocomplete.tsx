import { nostojs } from "@nosto/nosto-js"
import { SearchKeyword, SearchProduct, SearchQuery } from "@nosto/nosto-js/client"
import { AutocompletePageProvider } from "@preact/autocomplete/AutocompletePageProvider"
import { Store } from "@preact/common/store/store"
import { bindInput, disableNativeAutocomplete } from "@utils/bindInput"
import { debounce } from "@utils/debounce"
import { measure } from "@utils/performance"
import { render, VNode } from "preact"

import ErrorBoundary from "../components/ErrorBoundary"
import { AutocompleteInjectConfig } from "../config"
import { bindBlur, bindClickOutside } from "../helpers/dom"
import { resolveCssSelector } from "../resolveCssSelector"
import { waitForElements } from "../wait"
import { AutocompleteContext } from "./autocomplete/AutocompleteContext"
import { AutocompleteDropdown, createDropdownComponent } from "./autocomplete/components/AutocompleteDropdown"
import { AutocompleteHistory, createHistoryComponent } from "./autocomplete/components/AutocompleteHistory"
import { onClick } from "./autocomplete/events/onClick"
import { onFocus } from "./autocomplete/events/onFocus"
import { onInput } from "./autocomplete/events/onInput"
import { onKeyDown } from "./autocomplete/events/onKeyDown"
import { onSubmit } from "./autocomplete/events/onSubmit"

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
  const { config, dropdownCssSelector } = injectConfig
  const dropdown = createDropdownComponent(input, dropdownCssSelector)
  const history = createHistoryComponent(input, dropdownCssSelector, config.historySize)

  const context: AutocompleteInjectContext = {
    ...injectConfig,
    input,
    dropdown,
    history,
    store,
    debouncer: debounce(config.debounceDelay)
  }

  injectSpeechToText(context)

  input.setAttribute("data-nosto-element", "search-input")
  store.updateState({
    historyItems: history.get()
  })

  disableNativeAutocomplete(input)

  renderAutocompleteOnStoreInit(context)
  store.onInit(() => {
    renderAutocompleteOnStoreInit(context)
  })

  bindInput(input, {
    onInput: value => onInput(value, context),
    onFocus: value => onFocus(value, context),
    onClick: value => onClick(value, context),
    onSubmit: value => onSubmit(value, context),
    onKeyDown: (value, key) => onKeyDown(value, key, context)
  })
  bindBlur(history.element, history.hide)
  bindBlur(dropdown.element, dropdown.hide)
  bindClickOutside([history.element, input], history.hide)
  bindClickOutside([dropdown.element, input], dropdown.hide)
}

export type AutocompleteInjectContext = AutocompleteInjectConfig & {
  input: HTMLInputElement
  dropdown: AutocompleteDropdown
  history: AutocompleteHistory
  store: Store
  debouncer: ReturnType<typeof debounce>
}

function renderAutocompleteOnStoreInit(context: AutocompleteInjectContext) {
  const { dropdown, renderAutocomplete } = context
  if (!renderAutocomplete) {
    return
  }
  const userComponentRenderer = createUserComponentRenderer(context)
  const end = measure("renderAutocomplete")
  userComponentRenderer(renderAutocomplete, dropdown.element)
  end()
}

async function injectSpeechToText(context: AutocompleteInjectContext) {
  const { input, renderSpeechToText, config, store } = context
  if (!renderSpeechToText) return

  const speechToTextClass = "ns-autocomplete-voice-position"

  const hasSpeechToTextAlready = !!input.parentElement?.querySelector(`.${speechToTextClass}`)
  if (hasSpeechToTextAlready) return

  const locationHelperElement = document.createElement("div")
  locationHelperElement.className = speechToTextClass
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

function createEventHandlers({ dropdown, history, store, input, onNavigateToSearch }: AutocompleteInjectContext) {
  const onReportClick = (query: string, isKeyword: boolean) => {
    dropdown.hide()
    history.hide()
    if (!query) {
      return
    }

    history.add(query)
    store.updateState({
      historyItems: history.get()
    })
    if (isKeyword) {
      nostojs(api => api.recordSearchSubmit(query))
    }
    input.value = query
  }

  return {
    onReportProductClick: (product: SearchProduct) => {
      onReportClick(product.name!, false)
    },
    onReportKeywordClick: (keyword: SearchKeyword) => {
      onReportClick(keyword.keyword, true)
    },
    onHandleSubmit: (query: SearchQuery) => {
      onReportClick(query.query!, false)
      onNavigateToSearch?.(query)
    }
  }
}

export function createUserComponentRenderer(context: AutocompleteInjectContext) {
  const { config, store } = context
  const eventHandlers = createEventHandlers(context)
  return (renderer: () => VNode | Promise<VNode>, target: HTMLDivElement) =>
    render(
      <ErrorBoundary>
        <AutocompletePageProvider config={config} store={store}>
          <AutocompleteContext
            value={{
              reportProductClick: eventHandlers.onReportProductClick,
              reportKeywordClick: eventHandlers.onReportKeywordClick,
              handleSubmit: eventHandlers.onHandleSubmit
            }}
          >
            {renderer()}
          </AutocompleteContext>
        </AutocompletePageProvider>
      </ErrorBoundary>,
      target
    )
}
