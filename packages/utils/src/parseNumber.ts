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
