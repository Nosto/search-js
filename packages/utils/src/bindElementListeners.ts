export type InputBindingCallbacks = {
  onSubmit?: (value: string) => void
  onInput?: (value: string) => void
  onFocus?: (value: string) => void
  onKeyDown?: (value: string, key: string) => void
  onClick?: (value: string) => void
}

export interface BindElementOptions {
  form?: HTMLFormElement
  allowNativeSubmit?: boolean
}

export function bindElementListeners(
  target: HTMLInputElement,
  callbacks: InputBindingCallbacks,
  options: BindElementOptions = {}
): {
  destroy: () => void
} {
  const unbindCallbacks = [target].flatMap(el => {
    const cbs: Array<() => void> = []
    const form = options?.form !== undefined ? options.form : el.form

    if (callbacks.onSubmit) {
      const onKeyDown = (event: KeyboardEvent) => {
        callbacks.onKeyDown?.(el.value, event.key)
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault()
        }

        if (event.key === "Enter") {
          if (el.value !== "" && !event.repeat) {
            callbacks.onSubmit?.(el.value)
          }
          event.preventDefault()
        }
      }
      el.addEventListener("keydown", onKeyDown)
      cbs.push(() => {
        el.removeEventListener("keydown", onKeyDown)
      })

      if (form && !options.allowNativeSubmit) {
        const onSubmit = (event: SubmitEvent) => {
          event.preventDefault()
          callbacks.onSubmit?.(el.value)
        }
        form.addEventListener("submit", onSubmit)
        cbs.push(() => form.removeEventListener("submit", onSubmit))

        const buttons = Array.from(form.querySelectorAll("[type=submit]"))
        buttons.forEach(button => {
          const onClick = (event: Event) => {
            event.preventDefault()
            callbacks.onSubmit?.(el.value)
          }

          button.addEventListener("click", onClick)
          cbs.push(() => {
            button.removeEventListener("click", onClick)
          })
        })
      }
    }

    if (callbacks.onClick) {
      const onClick = () => callbacks.onClick?.(el.value)
      el.addEventListener("click", onClick)
      cbs.push(() => el.removeEventListener("click", onClick))
    }

    if (callbacks.onFocus) {
      const onFocus = () => callbacks.onFocus?.(el.value)
      el.addEventListener("focus", onFocus)
      cbs.push(() => el.removeEventListener("focus", onFocus))
    }

    if (callbacks.onInput) {
      const onInput = () => callbacks.onInput?.(el.value)
      el.addEventListener("input", onInput)
      cbs.push(() => el.removeEventListener("input", onInput))
    }

    return cbs
  })

  return {
    destroy() {
      unbindCallbacks.forEach(v => v())
    }
  }
}
