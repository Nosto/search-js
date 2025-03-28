import { isBot } from "@utils/isBot"

/**
 * Function to calculate the new query values for loading more products
 */
export function getNextPageQuery({ from, size, pageSize }: { from: number; size: number; pageSize: number }) {
  if (isBot()) {
    // increase from value for bots to move to the next page instead of loading more products
    return {
      products: { from: from + pageSize }
    }
  }
  return {
    products: { size: size + pageSize }
  }
}
