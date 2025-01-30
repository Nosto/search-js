/**
 * Should the error trigger a search retry
 */
export function shouldRetry(error: unknown): error is object {
  if (!error || typeof error !== "object") {
    return false
  }

  return !("status" in error) || isValidStatus(error.status)
}

function isValidStatus(status: unknown) {
  return typeof status === "number" && (status < 400 || status >= 500)
}
