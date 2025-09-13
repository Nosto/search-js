export function findAll<T extends Element>(selector: string) {
  return Array.from(document.querySelectorAll<T>(selector))
}
