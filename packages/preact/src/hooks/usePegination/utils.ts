export function range(start: number, end: number): number[] {
  const diff = end - start
  if (!isNaN(diff) && diff > 0) {
    return new Array(end - start).fill(undefined).map((_, i) => i + start)
  }
  return []
}
