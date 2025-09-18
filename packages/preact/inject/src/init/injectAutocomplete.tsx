import { AutocompletePageProvider } from "@preact/autocomplete/AutocompletePageProvider"
import { Store } from "@preact/common/store/store"
import { bindBlur } from "@utils/bindBlur"
import { bindClickOutside } from "@utils/bindClickOutside"
import { bindInput, disableNativeAutocomplete } from "@utils/bindInput"
import { debounce } from "@utils/debounce"
import { measure } from "@utils/performance"
import { render, VNode } from "preact"

import ErrorBoundary from "../components/ErrorBoundary"
import { AutocompleteInjectConfig } from "../config"
import { resolveCssSelector } from "../resolveCssSelector"
import { waitForElements } from "../wait"
import { AutocompleteContext, createContextHandle } from "./autocomplete/AutocompleteContext"
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

  store.onInit(() => {
    renderAutocompleteComponent(context)
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
  bindClickOutside({ element: history.element, input }, history.hide)
  bindClickOutside({ element: dropdown.element, input }, dropdown.hide)
}

export type AutocompleteInjectContext = AutocompleteInjectConfig & {
  input: HTMLInputElement
  dropdown: AutocompleteDropdown
  history: AutocompleteHistory
  store: Store
  debouncer: ReturnType<typeof debounce>
}

function renderAutocompleteComponent(context: AutocompleteInjectContext) {
  const { dropdown, renderAutocomplete } = context
  if (!renderAutocomplete) {
    return
  }
  const userComponentRenderer = createUserComponentRenderer(context, dropdown)
  dropdown.onHighlightChange(() => {
    userComponentRenderer(renderAutocomplete, dropdown.element)
  })
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

export function createUserComponentRenderer(
  injectContext: AutocompleteInjectContext,
  element: AutocompleteDropdown | AutocompleteHistory
) {
  const { config, store } = injectContext
  const userContext = createContextHandle(injectContext, element)
  element.onHighlightChange(() => {
    userContext.highlightedElementIndex = element.highlightedIndex()
  })
  return (renderer: () => VNode | Promise<VNode>, target: HTMLDivElement) =>
    render(
      <ErrorBoundary>
        <AutocompletePageProvider config={config} store={store}>
          <AutocompleteContext value={userContext}>{renderer()}</AutocompleteContext>
        </AutocompletePageProvider>
      </ErrorBoundary>,
      target
    )
}
