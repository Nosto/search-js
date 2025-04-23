import { isPlainObject } from "./isPlainObject"

export function isEqual(a: unknown, b: unknown, ignoreFields: string[] = []): boolean {
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
    const entriesA = Object.entries(a).filter(([k]) => !ignoreFields.includes(k))
    const entriesB = Object.entries(b).filter(([k]) => !ignoreFields.includes(k))

    if (entriesA.length !== entriesB.length) {
      return false
    }
    return entriesA.every(([k, v]) => isEqual(v, b[k], ignoreFields))
  }
  return false
}
