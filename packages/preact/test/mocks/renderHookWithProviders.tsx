import { createStore, Store } from "@preact/store"
import { StoreProvider } from "@preact/storeContext"
import { renderHook, RenderHookOptions, RenderHookResult } from "@testing-library/preact"

type ExtendedOptions<Props> = RenderHookOptions<Props> & { store?: Store }

export function renderHookWithProviders<Result, Props>(
  render: (initialProps: Props) => Result,
  options?: ExtendedOptions<Props>
): RenderHookResult<Result, Props> {
  return renderHook(render, { ...options, wrapper: makeWrapper(options) })
}

function makeWrapper<Props>(options: ExtendedOptions<Props> = {}) {
  const store = options.store ?? createStore({})
  const UserWrapper = options.wrapper

  if (!UserWrapper) {
    return function Wrapper({ children }: { children: Element }) {
      return <StoreProvider store={store}>{children}</StoreProvider>
    }
  }

  return function Wrapper({ children }: { children: Element }) {
    return (
      <StoreProvider store={store}>
        <UserWrapper>{children}</UserWrapper>
      </StoreProvider>
    )
  }
}
