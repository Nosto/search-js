import { InferOutput, number, object, string } from "valibot"

export const savedScrollSchema = object({
  url: string(),
  scrollY: number()
})

export type SavedScroll = InferOutput<typeof savedScrollSchema>
