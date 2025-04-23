/**
 * Takes a value and returns it as a number if possible.
 */
export function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number") {
    return value
  }
  if (typeof value !== "string") {
    return undefined
  }
  const parsed = Number(value)
  return !isNaN(parsed) ? parsed : undefined
}
