/**
 * This function takes an array and returns a new array with only unique values.
 */
export function unique<T>(arr: T[]) {
  return Array.from(new Set(arr))
}
