import { InferOutput, number, object, optional, string } from "valibot"

export const savedScrollSchema = object({
  url: string(),
  scrollY: number(),
  productCount: optional(number())
})

export type SavedScroll = InferOutput<typeof savedScrollSchema>
