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
