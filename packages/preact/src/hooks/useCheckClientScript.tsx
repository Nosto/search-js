import { nostojs } from "@nosto/nosto-js"
import { useEffect } from "preact/hooks"

export function useCheckClientScript() {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      console.error("Nosto client script has not loaded after 3 seconds.")
    }, 3000)
    nostojs(() => {
      window.clearTimeout(timeout)
    })
  }, [])
}
