/**
 * Find all elements matching a CSS selector
 * @param selector - CSS selector string
 * @returns Array of matching elements
 *
 * This is a utility wrapper around document.querySelectorAll that returns
 * a proper Array instead of NodeList, making it easier to work with.
 */
export function findAll<T extends Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector))
}
