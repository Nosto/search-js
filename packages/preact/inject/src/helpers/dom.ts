export function findAll<T extends Element>(selector: string) {
  return Array.from(document.querySelectorAll<T>(selector))
}

function getParents(target: Element) {
  const parentsList: Element[] = []
  let parent = target.parentNode
  while (parent && parent !== document && parent instanceof Element) {
    parentsList.push(parent)
    parent = parent.parentNode
  }
  return parentsList
}

export function bindClickOutside([element, input]: HTMLElement[], callback: () => void) {
  // eslint-disable-next-line func-style
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

export function bindBlur(element: HTMLElement, callback: () => void): void {
  element.tabIndex = 0
  element.addEventListener("blur", callback)
}
