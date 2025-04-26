export type InputBindingCallbacks = {
  onSubmit?: (value: string) => void
  onInput?: (value: string) => void
  onFocus?: (value: string) => void
  onKeyDown?: (value: string, key: string) => void
  onClick?: (value: string) => void
}

export interface BindElementOptions {
  form?: HTMLFormElement
}

export function disableNativeAutocomplete(target: HTMLInputElement) {
  target.setAttribute("autocomplete", "off")
}

export function bindInput(
  target: HTMLInputElement,
  callbacks: InputBindingCallbacks,
  { form = target.form! }: BindElementOptions = {}
): {
  destroy: () => void
} {
  const cbs: Array<() => void> = []

  if (callbacks.onKeyDown || callbacks.onSubmit) {
    const onKeyDown = (event: KeyboardEvent) => {
      callbacks.onKeyDown?.(target.value, event.key)
      if (callbacks.onKeyDown && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault()
      } else if (callbacks.onSubmit && event.key === "Enter") {
        if (target.value !== "" && !event.repeat) {
          callbacks.onSubmit?.(target.value)
        }
        event.preventDefault()
      }
    }

    target.addEventListener("keydown", onKeyDown)
    cbs.push(() => {
      target.removeEventListener("keydown", onKeyDown)
    })
  }

  if (callbacks.onSubmit && form) {
    const onSubmit = (event: SubmitEvent) => {
      event.preventDefault()
      callbacks.onSubmit?.(target.value)
    }
    form.addEventListener("submit", onSubmit)
    cbs.push(() => {
      form?.removeEventListener("submit", onSubmit)
    })

    const buttons = Array.from(form.querySelectorAll("[type=submit]"))
    buttons.forEach(button => {
      const onClick = (event: Event) => {
        event.preventDefault()
        callbacks.onSubmit?.(target.value)
      }

      button.addEventListener("click", onClick)
      cbs.push(() => {
        button.removeEventListener("click", onClick)
      })
    })
  }

  if (callbacks.onClick) {
    const onClick = () => {
      callbacks.onClick?.(target.value)
    }
    target.addEventListener("click", onClick)
    cbs.push(() => {
      target.removeEventListener("click", onClick)
    })
  }

  if (callbacks.onFocus) {
    const onFocus = () => {
      callbacks.onFocus?.(target.value)
    }
    target.addEventListener("focus", onFocus)
    cbs.push(() => {
      target.removeEventListener("focus", onFocus)
    })
  }

  if (callbacks.onInput) {
    const onInput = () => {
      callbacks.onInput?.(target.value)
    }

    target.addEventListener("input", onInput)
    cbs.push(() => {
      target.removeEventListener("input", onInput)
    })
  }

  return {
    destroy() {
      cbs.forEach(v => v())
    }
  }
}
