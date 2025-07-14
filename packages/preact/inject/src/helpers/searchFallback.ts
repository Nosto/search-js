import { cloneNode } from "./dom"

export const serpContentClassName = "nosto-serp-content"
export const serpContentNativeClassName = "nosto-serp-content-native"

export const searchFormClassName = "nosto-search-form"
export const searchFormNativeClassName = "nosto-search-form-native"

/**
 * Extracts all native content from the nosto search render target.
 * The copy will be restored in case of Nosto search being unavailable.
 */
export function extractNativeContent(element: Element): void {
  element.classList.add(serpContentClassName)

  const nativeContentContainer = document.createElement("div")
  nativeContentContainer.style.display = "none"
  nativeContentContainer.classList.add(serpContentNativeClassName)
  while (element.firstChild) {
    const child = element.firstChild
    element.removeChild(child)
    nativeContentContainer.appendChild(child)
  }

  // Element will always have a parent node
  element.parentNode!.appendChild(nativeContentContainer)
}

/**
 * Replaces the matching elements (via query selector) with a deep copy,
 * removing any attached event listeners in the process.
 *
 * The original elements are saved to be restored in case of Nosto search being unavailable.
 */
export async function extractNativeForm(selector: string, delay?: number) {
  if (delay) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  document.querySelectorAll<HTMLElement>(selector).forEach(el => {
    const newElement = cloneNode(el, true)

    newElement.classList.add(searchFormClassName)
    el.parentNode?.insertBefore(newElement, el)

    el.id = ""
    el.className = ""
    el.style.display = "none"
    el.classList.add(searchFormNativeClassName)
  })
}

export function restoreNativeContent() {
  const target = document.querySelector(`.${serpContentClassName}`)
  const nativeContentElement = document.querySelector(`.${serpContentNativeClassName}`)
  if (!target || !nativeContentElement) {
    return
  }

  while (target.firstChild) {
    target.removeChild(target.firstChild)
  }
  while (nativeContentElement.firstChild) {
    const child = nativeContentElement.firstChild
    nativeContentElement.removeChild(child)
    target.appendChild(child)
  }
  nativeContentElement.remove()
}

export function restoreNativeForm() {
  const unboundForms = document.querySelectorAll<HTMLElement>(`.${searchFormClassName}`)
  const nativeForms = document.querySelectorAll<HTMLElement>(`.${searchFormNativeClassName}`)
  unboundForms.forEach((form, index) => {
    const nativeForm = nativeForms[index]
    if (!nativeForm) {
      return
    }

    nativeForm.style.display = form.style.display
    nativeForm.id = form.id
    form.classList.remove(searchFormClassName)
    nativeForm.className = form.className
    form.remove()
  })
}
