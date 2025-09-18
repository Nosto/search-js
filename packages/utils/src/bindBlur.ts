/**
 * Bind blur event handler to an element
 * @param element - HTML element to bind blur event to
 * @param callback - Function to call when element loses focus
 */
export function bindBlur(element: HTMLElement, callback: () => void): void {
  element.addEventListener("blur", callback)
}
