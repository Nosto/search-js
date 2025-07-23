export function debounce(delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (callback: () => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(callback, delay)
  }
}
