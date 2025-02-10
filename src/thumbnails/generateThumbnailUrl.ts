import { ThumbnailSize } from "./types"
import { getSettings } from "@nosto/nosto-js"

export type Props = {
  // Also known as imageVersion
  size: ThumbnailSize
  productId: string
  hash?: string
}

/**
 * Generates a thumbnail URL for a given product and size
 */
export function generateThumbnailUrl({ size, productId, hash }: Props) {
  const settings = getSettings()
  if (!settings) {
    throw new Error("Client script settings are not yet available")
  }
  const baseUrl = `https://${settings.thumbnailHost}/${settings.account}/${size}/${productId}`
  return hash ? `${baseUrl}/${hash}/A` : baseUrl
}
