import { SwatchOption } from "../types"

const SIZE_ORDER = [
  "4XS",
  "3XS",
  "2XS",
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "2XL",
  "XXXL",
  "3XL",
  "4XL",
  "One Size"
]

function normalize(value: string, field: string): [number, number | string] {
  if (field === "size") {
    const numeric = parseFloat(value)
    if (!isNaN(numeric)) {
      return [0, numeric] // numeric values or numeric prefixes come first
    }

    const index = SIZE_ORDER.indexOf(value)
    if (index !== -1) {
      return [1, index] // known sizes come next, sorted by index
    }

    return [2, value] // unknown strings last, optionally sorted alphabetically
  }

  const parsed = parseFloat(value)
  return [0, isNaN(parsed) ? Infinity : parsed]
}

export function sortOptions(field: string, options: SwatchOption[]): SwatchOption[] {
  return [...options].sort((a, b) => {
    const [aGroup, aVal] = normalize(a.value, field)
    const [bGroup, bVal] = normalize(b.value, field)

    if (aGroup !== bGroup) return aGroup - bGroup
    if (typeof aVal === "number" && typeof bVal === "number") return aVal - bVal
    return String(aVal).localeCompare(String(bVal))
  })
}
