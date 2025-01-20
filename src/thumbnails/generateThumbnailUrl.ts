import { ThumbnailSize } from "./types"
import { getSettings } from "@nosto/nosto-js"

type Props = {
  // Also known as imageVersion
  size: ThumbnailSize
  productId: string
  hash: string
}

export function generateThumbnailUrl({ size, productId, hash }: Props) {
  const settings = getSettings()
  if (!settings) {
    throw new Error("Client script settings are not yet available")
  }
  return `https://${settings.thumbnailHost}/${settings.account}/${size}/${productId}/${hash}/A`
}
