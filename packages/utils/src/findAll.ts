export function findAll<T extends Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector))
}
