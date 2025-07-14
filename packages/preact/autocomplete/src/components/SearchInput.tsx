import { ComponentChildren, ComponentProps, ComponentType, JSX } from "preact"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsComponent = keyof JSX.IntrinsicElements | ComponentType<any>

type Props<C extends AsComponent> = {
  as?: C
  onSearchInput: (target: HTMLInputElement) => void
  children?: ComponentChildren
  componentProps?: JSX.LibraryManagedAttributes<C, ComponentProps<C>>
}

export function SearchInput<C extends AsComponent>({ as, componentProps, onSearchInput, children }: Props<C>) {
  const adjustedComponentProps = {
    ...componentProps!,
    onInput: (event: JSX.TargetedEvent<HTMLInputElement>) => {
      onSearchInput(event.target as HTMLInputElement)
    }
  }

  const Comp = as ?? "input"
  if (!as) {
    adjustedComponentProps.type = "search"
  }
  return <Comp {...adjustedComponentProps}>{children}</Comp>
}
