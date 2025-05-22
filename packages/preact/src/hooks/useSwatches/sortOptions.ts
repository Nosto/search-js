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

export function sortOptions(field: string, options: SwatchOption[]): SwatchOption[] {
  const isNumeric = (value: string) => /^\d+$/.test(value)
  if (field === "size") {
    return [...options].sort((a, b) => {
      const aIsNumeric = isNumeric(a.value)
      const bIsNumeric = isNumeric(b.value)

      if (aIsNumeric && bIsNumeric) {
        return parseInt(a.value) - parseInt(b.value)
      }

      if (aIsNumeric) return -1
      if (bIsNumeric) return 1

      const aIndex = SIZE_ORDER.indexOf(a.value)
      const bIndex = SIZE_ORDER.indexOf(b.value)

      const maxIndex = SIZE_ORDER.length

      const safeA = aIndex === -1 ? maxIndex : aIndex
      const safeB = bIndex === -1 ? maxIndex : bIndex

      return safeA - safeB
    })
  }

  if (options.every(opt => isNumeric(opt.value))) {
    return [...options].sort((a, b) => parseInt(a.value) - parseInt(b.value))
  }

  return options
}
