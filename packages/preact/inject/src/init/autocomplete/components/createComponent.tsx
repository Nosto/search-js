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

  const highlightElement = (elementList: Element[], highlightIndex: number) => {
    dropdown
      .querySelector(".ns-autocomplete-element.ns-autocomplete-element-hovered")
      ?.classList.remove("ns-autocomplete-element-hovered")
    elementList[highlightIndex]?.classList.add("ns-autocomplete-element-hovered")
  }

  const clearHighlight = () => {
    dropdown
      .querySelector(".ns-autocomplete-element.ns-autocomplete-element-hovered")
      ?.classList.remove("ns-autocomplete-element-hovered")
  }

  const getHighlightIndex = (removeHighlight?: boolean): number => {
    const elements = Array.from(dropdown.getElementsByClassName("ns-autocomplete-element"))

    const highlighted = elements.find(item => {
      if (item.classList.contains("ns-autocomplete-element-hovered")) {
        if (removeHighlight) {
          item.classList.remove("ns-autocomplete-element-hovered")
        }
        return true
      }
      return false
    })

    return highlighted ? elements.indexOf(highlighted) : -1
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
      const index = getHighlightIndex(true)
      highlightElement(elements, index >= 0 ? index + 1 : 0)
    },
    goUp: () => {
      const elements = Array.from(dropdown.getElementsByClassName("ns-autocomplete-element"))
      const index = getHighlightIndex(true)
      highlightElement(elements, (index >= 0 ? index : elements.length) - 1)
    },
    highlight: highlightElement,
    highlightedIndex: getHighlightIndex,
    submitHighlightedItem: (highlightedIndex: number) => {
      const elements = Array.from(dropdown.querySelectorAll<HTMLElement>(".ns-autocomplete-element"))
      elements[highlightedIndex]?.click()
    }
  }
}
