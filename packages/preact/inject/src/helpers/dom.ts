export type DOMTarget = string | Element

export function findAll<T extends Element>(selector: DOMTarget, filterType?: { new (): T }): T[] {
  const elements = typeof selector === "string" ? Array.from(document.querySelectorAll(selector)) : [selector]
  return elements.filter((v): v is T => (filterType ? v instanceof filterType : true))
}

export async function DOMReady(): Promise<void> {
  return new Promise(resolve => {
    if (document.readyState !== "loading") {
      resolve()
    } else {
      window.addEventListener("DOMContentLoaded", () => {
        resolve()
      })
    }
  })
}

// TODO: Replace with something that works better with custom elements
export function cloneNode<T extends Node>(node: T, deep: boolean): T {
  return node.cloneNode(deep) as T
}
