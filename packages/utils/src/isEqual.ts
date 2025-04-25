import { isPlainObject } from "./isPlainObject"

/**
 * Compares two values for equality.
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((v, i) => isEqual(v, b[i]))
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const entriesA = Object.entries(a)

    if (entriesA.length !== Object.keys(b).length) {
      return false
    }
    return entriesA.every(([k, v]) => isEqual(v, b[k]))
  }
  return false
}
