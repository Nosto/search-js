export default function parseNumber<T>(value: T): number | undefined {
  if (typeof value === "number") {
    return value
  }
  if (typeof value !== "string") {
    return undefined
  }
  if (isNaN(Number(value))) {
    return undefined
  }
  const parsed = parseFloat(value)
  return !isNaN(parsed) ? parsed : undefined
}
