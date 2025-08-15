import { CssSelector } from "@preact/inject/resolveCssSelector"

import { createComponent } from "./createComponent"

export type AutocompleteDropdown = ReturnType<typeof createDropdownComponent>

export function createDropdownComponent(input: HTMLInputElement, dropdownSelector: CssSelector) {
  const dropdown = document.createElement("div")
  dropdown.className = "nosto-autocomplete-dropdown"
  const base = createComponent(input, dropdown, dropdownSelector)

  return {
    ...base,
    element: dropdown
  }
}
