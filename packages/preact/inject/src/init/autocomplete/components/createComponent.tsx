import { CssSelector, resolveCssSelector } from "@preact/inject/resolveCssSelector"

export function createComponent(input: HTMLInputElement, dropdown: HTMLDivElement, dropdownSelector: CssSelector) {
  dropdown.style.display = "none"

  const wrapper = (() => {
    if (input.parentElement && input.parentElement.classList.contains("nosto-autocomplete-wrapper")) {
      return input.parentElement
    }

    const wrapper = document.createElement("div")
    wrapper.className = "nosto-autocomplete-wrapper"
    input.parentNode?.insertBefore(wrapper, input.nextSibling)
    wrapper.appendChild(input)
    return wrapper
  })()

  const dropdownLocator = resolveCssSelector(dropdownSelector)
  const dropdownParent = dropdownLocator && document.querySelector(dropdownLocator.selector)

  if (dropdownParent) {
    const form = document.createElement("form")
    form.className = "nosto-dropdown-form"
    form.appendChild(dropdown)
    if (dropdownLocator.position === "first") {
      dropdownParent.prepend(form)
    } else {
      dropdownParent.appendChild(form)
    }
  } else {
    wrapper.appendChild(dropdown)
  }

  const highlightState = {
    index: -1,
    onChangeListeners: [] as (() => void)[]
  }

  // eslint-disable-next-line func-style
  const highlightElement = (elements: Element[], highlightIndex: number) => {
    const totalCount = elements.length
    if (totalCount === 0) {
      highlightIndex = -1
    }
    highlightState.index = highlightIndex >= 0 ? highlightIndex % totalCount : totalCount - 1
    highlightState.onChangeListeners.forEach(callback => callback())
  }
  // eslint-disable-next-line func-style
  const clearHighlight = () => {
    highlightState.index = -1
    highlightState.onChangeListeners.forEach(callback => callback())
  }
  // eslint-disable-next-line func-style
  const getHighlightIndex = () => {
    return highlightState.index
  }

  return {
    element: dropdown,
    hide: () => {
      dropdown.style.display = "none"
      clearHighlight()
    },
    show: () => {
      dropdown.style.display = "inherit"
    },
    isOpen: () => dropdown.style.display !== "none",
    goDown: () => {
      const elements = Array.from(dropdown.getElementsByClassName("ns-autocomplete-element"))
      const index = getHighlightIndex()
      highlightElement(elements, index + 1)
    },
    goUp: () => {
      const elements = Array.from(dropdown.getElementsByClassName("ns-autocomplete-element"))
      const index = getHighlightIndex()
      highlightElement(elements, index - 1)
    },
    highlight: highlightElement,
    highlightedIndex: getHighlightIndex,
    submitHighlightedItem: (highlightedIndex: number) => {
      const elements = Array.from(dropdown.querySelectorAll<HTMLElement>(".ns-autocomplete-element"))
      elements[highlightedIndex]?.click()
    },
    onHighlightChange: (callback: () => void) => {
      highlightState.onChangeListeners.push(callback)
    }
  }
}
