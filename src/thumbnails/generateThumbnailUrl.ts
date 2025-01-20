import { ThumbnailSize } from "./types"
import { getSettings } from "@nosto/nosto-js"

type Props = {
  // Also known as imageVersion
  size: ThumbnailSize
  productId: string
  hash: string
}

const imageSizeToApiCodeMap = {
  "170x170": "1",
  "100x100": "2",
  "90x70": "3",
  "50x50": "4",
  "30x30": "5",
  "100x140": "6",
  "200x200": "7",
  "400x400": "8",
  "750x750": "9",
  "Max Square": "10",
  "200x200 Square": "11",
  "400x400 Square": "12",
  "750x750 Square": "13",
  Original: "orig"
}

function imageSizeToApiCode(size: ThumbnailSize) {
  const matchingValue = imageSizeToApiCodeMap[size]
  if (!matchingValue) {
    throw new Error(`Unknown image size: ${size}`)
  }
  return matchingValue
}

export function generateThumbnailUrl({ size, productId, hash }: Props) {
  const settings = getSettings()
  if (!settings) {
    throw new Error("Client script settings are not yet available")
  }
  return `https://${settings.thumbnailHost}/${settings.account}/${imageSizeToApiCode(size)}/${productId}/${hash}/A`
}
