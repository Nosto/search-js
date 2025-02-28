import { nostojs } from "@nosto/nosto-js"

export function useCheckClientScript() {
  const timeout = window.setTimeout(() => {
    console.error("Nosto client script has not loaded after 3 seconds.")
  }, 3000)
  nostojs(() => {
    window.clearTimeout(timeout)
  })
}
