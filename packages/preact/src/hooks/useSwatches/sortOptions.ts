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

function getSortIndex(value: string, field: string) {
  const num = parseFloat(value)
  if (!isNaN(num)) return num

  if (field === "size") {
    const index = SIZE_ORDER.indexOf(value)
    return index === -1 ? SIZE_ORDER.length : index
  }

  return Number.MAX_SAFE_INTEGER
}

export function sortOptions(field: string, options: SwatchOption[]) {
  if (field === "size") {
    return [...options].sort((a, b) => {
      const aNum = parseFloat(a.value)
      const bNum = parseFloat(b.value)

      const aIsNum = !isNaN(aNum)
      const bIsNum = !isNaN(bNum)

      if (aIsNum && bIsNum) return aNum - bNum
      if (aIsNum) return -1
      if (bIsNum) return 1

      const aIndex = getSortIndex(a.value, field)
      const bIndex = getSortIndex(b.value, field)

      return aIndex - bIndex
    })
  }

  return [...options].sort((a, b) => parseFloat(a.value) - parseFloat(b.value))
}
