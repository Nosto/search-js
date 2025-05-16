import { JSX } from "preact"

type Props = {
  placeholder: string
} & JSX.IntrinsicElements["input"]

// Tiny example input component to check headless rendering
export function Input({ placeholder, ...rest }: Props) {
  return <input type="search" placeholder={placeholder} {...rest} />
}
