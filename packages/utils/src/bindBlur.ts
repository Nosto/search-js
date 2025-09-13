export function bindBlur(element: HTMLElement, callback: () => void): void {
  element.tabIndex = 0
  element.addEventListener("blur", callback)
}
