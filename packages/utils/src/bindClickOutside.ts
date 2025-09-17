/**
 * Get parent elements of a target element
 * @param target - Element to get parents for
 * @returns Array of parent elements
 */
function getParents(target: Element): Element[] {
  const parentsList: Element[] = []
  let parent = target.parentNode
  while (parent && parent !== document && parent instanceof Element) {
    parentsList.push(parent)
    parent = parent.parentNode
  }
  return parentsList
}

/**
 * Bind click outside event handler
 * @param elements - Array containing [element, input] HTMLElements
 * @param callback - Function to call when clicking outside
 * @returns Object with destroy method to cleanup event listener
 */
export function bindClickOutside([element, input]: HTMLElement[], callback: () => void) {
  const onClick = (event: MouseEvent) => {
    const target = event.target

    if (target instanceof HTMLElement && element) {
      if (target !== element && target !== input && !getParents(target).includes(element)) {
        callback()
      }
    }
  }

  document.addEventListener("click", onClick)

  return {
    destroy: () => {
      document.removeEventListener("click", onClick)
    }
  }
}
