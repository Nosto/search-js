import { beforeEach, describe, expect, it, vi } from "vitest"

import { bindInput } from "../src/bindInput"

describe("bindInput", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })
  it("should bind and unbind keydown listener when onSubmit is provided", () => {
    const el = document.createElement("input")
    const callbacks = {
      onSubmit: vi.fn(),
      onKeyDown: vi.fn()
    }

    const { destroy } = bindInput(el, callbacks)

    const event = new KeyboardEvent("keydown", { key: "Enter" })
    el.value = "test"
    el.dispatchEvent(event)

    expect(callbacks.onSubmit).toHaveBeenCalledWith("test")
    expect(callbacks.onKeyDown).toHaveBeenCalledWith("test", "Enter")

    destroy()

    el.dispatchEvent(event)
    expect(callbacks.onSubmit).toHaveBeenCalledTimes(1)
  })

  it("should prevent default on ArrowDown and ArrowUp keydown events", () => {
    const el = document.createElement("input")
    document.body.appendChild(el)

    const callbacks = {
      onKeyDown: vi.fn()
    }
    bindInput(el, callbacks)

    const keyDownEventOptions = {
      bubbles: true,
      cancelable: true
    }

    const arrowDownEvent = new KeyboardEvent("keydown", { ...keyDownEventOptions, key: "ArrowDown" })
    const arrowUpEvent = new KeyboardEvent("keydown", { ...keyDownEventOptions, key: "ArrowUp" })
    el.dispatchEvent(arrowDownEvent)
    el.dispatchEvent(arrowUpEvent)
    expect(arrowDownEvent.defaultPrevented).toBe(true)
    expect(arrowUpEvent.defaultPrevented).toBe(true)
  })

  it("should bind and unbind submit listener to the form", () => {
    const el = document.createElement("input")
    const form = document.createElement("form")
    form.appendChild(el)
    document.body.appendChild(form)

    const callbacks = {
      onSubmit: vi.fn()
    }

    bindInput(el, callbacks, { form })

    const event = new SubmitEvent("submit", { bubbles: true, cancelable: true })
    form.dispatchEvent(event)

    expect(callbacks.onSubmit).toHaveBeenCalledWith(el.value)
    expect(event.defaultPrevented).toBe(true)
  })

  it("should bind and unbind click listener to submit buttons in the form", () => {
    const el = document.createElement("input")
    const form = document.createElement("form")
    const button = document.createElement("button")
    button.type = "submit"
    form.appendChild(el)
    form.appendChild(button)
    document.body.appendChild(form)

    const callbacks = {
      onSubmit: vi.fn()
    }

    bindInput(el, callbacks, { form })

    const event = new Event("click", { bubbles: true, cancelable: true })
    button.dispatchEvent(event)

    expect(callbacks.onSubmit).toHaveBeenCalledWith(el.value)
    expect(event.defaultPrevented).toBe(true)
  })

  it("should bind and unbind click listener when onClick is provided", () => {
    const el = document.createElement("input")
    const callbacks = {
      onClick: vi.fn()
    }

    bindInput(el, callbacks)
    el.dispatchEvent(new Event("click"))
    expect(callbacks.onClick).toHaveBeenCalledWith(el.value)
  })

  it("should bind and unbind focus listener when onFocus is provided", () => {
    const el = document.createElement("input")
    const callbacks = {
      onFocus: vi.fn()
    }

    bindInput(el, callbacks)
    el.dispatchEvent(new Event("focus"))
    expect(callbacks.onFocus).toHaveBeenCalledWith(el.value)
  })

  it("should bind and unbind input listener when onInput is provided", () => {
    const el = document.createElement("input")
    const callbacks = {
      onInput: vi.fn()
    }

    bindInput(el, callbacks)
    el.dispatchEvent(new Event("input"))
    expect(callbacks.onInput).toHaveBeenCalledWith(el.value)
  })
})
