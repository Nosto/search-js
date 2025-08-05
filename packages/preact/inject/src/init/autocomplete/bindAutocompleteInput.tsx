import { AutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { Store } from "@preact/common/store/store"
import { AutocompleteInjectConfig } from "@preact/inject/config"
import { bindInput } from "@utils/bindInput"
import { debounce } from "@utils/debounce"

import { AutocompleteDropdown, AutocompleteHistory } from "../injectAutocomplete"
import { onClick } from "./events/onClick"
import { onFocus } from "./events/onFocus"
import { onInput } from "./events/onInput"
import { onKeyDown } from "./events/onKeyDown"
import { onSubmit } from "./events/onSubmit"

export type InputEventContext = AutocompleteInjectConfig & {
  dropdown: AutocompleteDropdown
  history: AutocompleteHistory
  config: AutocompleteConfig
  store: Store
  debouncer: ReturnType<typeof debounce>
}

export function bindAutocompleteInput(
  input: HTMLInputElement,
  history: AutocompleteHistory,
  dropdown: AutocompleteDropdown,
  injectConfig: AutocompleteInjectConfig,
  store: Store
) {
  const config = injectConfig.config
  const debouncer = debounce(config.debounceDelay)

  const eventContext: InputEventContext = {
    ...injectConfig,
    dropdown,
    history,
    config,
    store,
    debouncer
  }

  const bind = bindInput(input, {
    onInput: value => onInput(value, eventContext),
    onFocus: value => onFocus(value, eventContext),
    onClick: value => onClick(value, eventContext),
    onSubmit: value => onSubmit(value, eventContext),
    onKeyDown: (value, key) => onKeyDown(value, key, eventContext)
  })

  return {
    destroy() {
      bind.destroy()
    }
  }
}
