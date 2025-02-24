import { NostoSize } from "./types"
import { getSettings } from "@nosto/nosto-js"

export type Config = {
  size: NostoSize
  productId: string
  hash: string
}

/**
 * Generates a thumbnail URL for a given product and size
 */
export function generateThumbnailUrl({ size, productId, hash }: Config) {
  const settings = getSettings()
  if (!settings) {
    throw new Error("Client script settings are not yet available")
  }
  return `https://${settings.thumbnailHost}/${settings.account}/${size}/${productId}/${hash}/A`
}
