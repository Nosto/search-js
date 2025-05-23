import { SwatchOption } from "../types"

const SIZE_ORDER = ["4XS", "3XS", "2XS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL"]

function normalize(value: string): number | string {
  const num = parseFloat(value)
  if (!isNaN(num)) return num

  const index = SIZE_ORDER.indexOf(value)
  if (index !== -1) return 1000 + index

  return value
}

export function sortOptions(_: string, options: SwatchOption[]): SwatchOption[] {
  return [...options].sort((a, b) => {
    const [aa, bb] = [a.value, b.value].map(normalize)
    return aa < bb ? -1 : aa > bb ? 1 : 0
  })
}
