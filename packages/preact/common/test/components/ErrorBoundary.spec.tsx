import { ErrorBoundary } from "@preact/common/components/ErrorBoundary"
import { render } from "@testing-library/preact"
import * as loggerModule from "@utils/logger"
import * as preactHooks from "preact/hooks"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("preact/hooks", async importOriginal => {
  const actual = await importOriginal<typeof import("preact/hooks")>()
  return { ...actual, useErrorBoundary: vi.fn() }
})

describe("ErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("logs a warning when an error is caught", () => {
    const error = new Error("Test error")
    vi.mocked(preactHooks.useErrorBoundary).mockReturnValue([error, vi.fn()])
    const warnSpy = vi.spyOn(loggerModule.logger, "warn").mockImplementation(() => {})
    const errorSpy = vi.spyOn(loggerModule.logger, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <div>child</div>
      </ErrorBoundary>
    )

    expect(warnSpy).toHaveBeenCalledWith("Error caught in ErrorBoundary", error)
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it("renders children when no error occurs", () => {
    vi.mocked(preactHooks.useErrorBoundary).mockReturnValue([undefined, vi.fn()])

    const result = render(
      <ErrorBoundary>
        <div>Safe Child</div>
      </ErrorBoundary>
    )

    expect(result.getByText("Safe Child")).toBeDefined()
  })
})
