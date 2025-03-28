/**
 * Generate an array of numbers from start to exlusive end
 * @param start number of array range start
 * @param end number of array range end
 * @returns an array of numbers from start to exlusive end
 * @example
 * ```ts
 * range(1, 5) // [1, 2, 3, 4]
 * ```
 */
export function range(start: number, end: number): number[] {
  const diff = end - start
  if (!isNaN(diff) && diff > 0) {
    return new Array(end - start).fill(undefined).map((_, i) => i + start)
  }
  return []
}
