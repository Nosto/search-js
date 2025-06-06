export type InputBindingCallbacks = {
  onSubmit?: (value: string) => void
  onInput?: (value: string) => void
  onFocus?: (value: string) => void
  onKeyDown?: (value: string, key: string) => void
  onClick?: (value: string) => void
}

export interface BindElementOptions {
  form?: HTMLFormElement
  nativeSubmit?: boolean
}

export function disableNativeAutocomplete(target: HTMLInputElement) {
  target.setAttribute("autocomplete", "off")
}

export function bindInput(
  target: HTMLInputElement,
  { onClick, onFocus, onInput, onKeyDown, onSubmit }: InputBindingCallbacks,
  { form = target.form ?? undefined, nativeSubmit }: BindElementOptions = {}
): {
  destroy: () => void
} {
  const cbs: Array<() => void> = []

  function addEventListener<E extends Event>(target: EventTarget, event: string, handler: (e: E) => void) {
    target.addEventListener(event, handler as EventListener)
    cbs.push(() => target.removeEventListener(event, handler as EventListener))
  }

  if (onKeyDown || onSubmit) {
    addEventListener(target, "keydown", (event: KeyboardEvent) => {
      onKeyDown?.(target.value, event.key)
      if (onKeyDown && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault()
      } else if (onSubmit && event.key === "Enter") {
        if (target.value !== "" && !event.repeat) {
          onSubmit(target.value)
        }
        if (!nativeSubmit) {
          event.preventDefault()
        }
      }
    })
  }

  if (onSubmit && form) {
    addEventListener(form, "submit", event => {
      if (!nativeSubmit) {
        event.preventDefault()
      }
      onSubmit(target.value)
    })

    form.querySelectorAll("[type=submit]").forEach(button => {
      addEventListener(button, "click", event => {
        if (!nativeSubmit) {
          event.preventDefault()
        }
        onSubmit(target.value)
      })
    })
  }

  if (onClick) {
    addEventListener(target, "click", () => onClick(target.value))
  }

  if (onFocus) {
    addEventListener(target, "focus", () => onFocus(target.value))
  }

  if (onInput) {
    addEventListener(target, "input", () => onInput(target.value))
  }

  return {
    destroy() {
      cbs.forEach(v => v())
    }
  }
}
