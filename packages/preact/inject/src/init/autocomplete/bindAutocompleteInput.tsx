import { AutocompleteConfig } from "@preact/autocomplete/AutocompleteConfig"
import { AutocompletePageProvider } from "@preact/autocomplete/AutocompletePageProvider"
import { newSearch } from "@preact/common/actions/newSearch"
import { Store } from "@preact/common/store/store"
import ErrorBoundary from "@preact/inject/components/ErrorBoundary"
import { AutocompleteInjectConfig } from "@preact/inject/config"
import { bindInput } from "@utils/bindInput"
import { debounce } from "@utils/debounce"
import { logger } from "@utils/logger"
import { render } from "preact"

import { AutocompleteDropdown, AutocompleteHistory } from "../injectAutocomplete"

export function bindAutocompleteInput(
  input: HTMLInputElement,
  history: AutocompleteHistory,
  dropdown: AutocompleteDropdown,
  injectConfig: AutocompleteInjectConfig,
  store: Store
) {
  const config = injectConfig.config
  const debouncer = debounce(config.debounceDelay)

  const bind = bindInput(input, {
    onInput: value => onInput(value, dropdown, history, injectConfig, store, debouncer),
    onFocus: value => onFocus(value, injectConfig, store, history),
    onClick: value => onClick(value, dropdown, history, injectConfig, store),
    onSubmit: value => onSubmit(value, dropdown, history, injectConfig, store),
    onKeyDown: (value, key) => onKeyDown(dropdown, value, key, config, history)
  })

  return {
    destroy() {
      bind.destroy()
    }
  }
}

function onInput(
  value: string,
  dropdown: AutocompleteDropdown,
  history: AutocompleteHistory,
  injectConfig: AutocompleteInjectConfig,
  store: Store,
  debouncer: ReturnType<typeof debounce>
) {
  const config = injectConfig.config
  if (value.length >= config.minQueryLength) {
    dropdown.show()
    history.hide()
    debouncer(async () => {
      try {
        return await newSearch(
          { config: injectConfig.config, store },
          {
            query: value
          }
        )
      } catch (err) {
        logger.error("New search failed", err)
        return
      }
    })
  } else if (value.length === 0 && config.historyEnabled) {
    dropdown.hide()
    history.show()
  } else {
    dropdown.hide()
    history.hide()
  }
}

async function onFocus(
  value: string,
  injectConfig: AutocompleteInjectConfig,
  store: Store,
  history: AutocompleteHistory
) {
  const config = injectConfig.config
  if (value.length >= config.minQueryLength) {
    if (!value) {
      store.updateState({
        initialized: true,
        loading: false
      })
    }
  } else if (value.length === 0 && config.historyEnabled && !history.isOpen()) {
    if (!injectConfig.renderHistory) {
      return
    }
    history.show()
    const HistoryComponent = await injectConfig.renderHistory()
    render(
      <ErrorBoundary>
        <AutocompletePageProvider config={config} store={store}>
          {HistoryComponent}
        </AutocompletePageProvider>
      </ErrorBoundary>,
      history.element
    )
  }
}

function onClick(
  value: string,
  dropdown: AutocompleteDropdown,
  history: AutocompleteHistory,
  injectConfig: AutocompleteInjectConfig,
  store: Store
) {
  const shouldUpdateSearch = async (value: string) => {
    dropdown.hide()
    const query = store.getState()?.query?.query
    if (query !== value) {
      await newSearch({ config, store }, { query: value })
    }
    dropdown.show()
  }

  const config = injectConfig.config
  if (value.length >= config.minQueryLength) {
    shouldUpdateSearch(value)
    if (!value) {
      store.updateState({
        initialized: true,
        loading: false
      })
    }
  } else if (value.length === 0 && config.historyEnabled && !history.isOpen()) {
    if (!injectConfig.renderHistory || !config.historyEnabled) {
      return
    }
    history.show()
  }
}

function onSubmit(
  value: string,
  dropdown: AutocompleteDropdown,
  history: AutocompleteHistory,
  injectConfig: AutocompleteInjectConfig,
  store: Store
) {
  const storeHistoryState = () => {
    store.updateState({
      historyItems: history.get()
    })
  }

  if (value.length >= injectConfig.config.minQueryLength) {
    dropdown.hide()
    history.hide()
    history.add(value)
    storeHistoryState()
    const highlighted = dropdown.highlightedIndex()
    if (highlighted >= 0) {
      dropdown.submitHighlightedItem(highlighted)
      return
    }
    injectConfig.onNavigateToSearch?.({
      query: value
    })
    dropdown.hide()
  }
}

function onKeyDown(
  dropdown: AutocompleteDropdown,
  _value: string,
  key: string,
  config: AutocompleteConfig,
  history: AutocompleteHistory
) {
  if (_value.length >= config.minQueryLength) {
    if (dropdown.isOpen()) {
      if (key === "ArrowDown") {
        dropdown.goDown()
      } else if (key === "ArrowUp") {
        dropdown.goUp()
      } else if (key === "Enter") {
        const highlighted = dropdown.highlightedIndex()
        if (highlighted >= 0) {
          dropdown.submitHighlightedItem(highlighted)
          return
        }
        dropdown.hide()
      }
    }
    if (key === "Escape") {
      dropdown.hide()
    } else if (key === "ArrowDown") {
      dropdown.show()
      history.hide()
    }
  }
  if (_value.length === 0 && config.historyEnabled) {
    if (history.isOpen()) {
      if (key === "ArrowDown") {
        history.goDown()
      } else if (key === "ArrowUp") {
        history.goUp()
      }
    }
    if (key === "Escape") {
      history.hide()
    } else if (key === "ArrowDown") {
      history.show()
    } else if (key === "Enter") {
      const highlighted = history.highlightedIndex()
      if (highlighted >= 0) {
        history.submitHighlightedItem(highlighted)
        return
      }
      history.hide()
    }
  }
}
