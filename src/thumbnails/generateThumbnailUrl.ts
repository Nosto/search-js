import { ThumbnailSize } from "./types"

type Props = {
  merchantId: string
  // Size or imageVersion
  size: ThumbnailSize
  productId: string
  hash: string
}

export function generateThumbnailUrl({ merchantId, size, productId, hash }: Props) {
  return `https://thumbs.nosto.com/${merchantId}/${size}/${productId}/${hash}/A`
}
