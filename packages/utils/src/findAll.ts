/**
 * Find all elements matching a CSS selector
 * @param selector - CSS selector string
 * @returns Array of matching elements
 */
export function findAll<T extends Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector))
}
