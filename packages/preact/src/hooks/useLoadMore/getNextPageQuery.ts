import { isBot } from "@utils/isBot"

type NextPageQueryProps = {
  from: number
  size: number
  pageSize: number
  cache?: boolean
}

/**
 * Function to calculate the new query values for loading more products
 */
export function getNextPageQuery({ from, size, pageSize, cache = false }: NextPageQueryProps) {
  if (isBot()) {
    // increase from value for bots to move to the next page instead of loading more products
    return {
      products: { from: from + pageSize }
    }
  }

  if (cache) {
    return {
      products: { size: size + pageSize }
    }
  }

  return {
    products: { from: from + pageSize, size: pageSize }
  }
}
