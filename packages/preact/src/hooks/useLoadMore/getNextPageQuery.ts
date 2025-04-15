import { isBot } from "@utils/isBot"

type NextPageQueryProps = {
  from: number
  size: number
  pageSize: number
  optimizedScrolling?: boolean
}

/**
 * Function to calculate the new query values for loading more products
 */
export function getNextPageQuery({ from, size, pageSize, optimizedScrolling = false }: NextPageQueryProps) {
  if (isBot()) {
    // increase from value for bots to move to the next page instead of loading more products
    return {
      products: { from: from + pageSize }
    }
  }
  return {
    products: optimizedScrolling ? { size: size + pageSize } : { from: (from ?? 0) + size, size: size }
  }
}
