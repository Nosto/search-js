import { useActions } from "@nosto/search-js/preact/hooks"
import { useEffect } from "preact/hooks"
import { useLocation } from "preact-iso"

export function SearchQueryHandler() {
  const { url } = useLocation()
  const { newSearch } = useActions()

  // Extract query parameter from URL and perform search
  useEffect(() => {
    const urlParams = new URLSearchParams(url.split("?")[1])
    const query = urlParams.get("q")

    if (query) {
      newSearch({
        query: query
      })
    }
  }, [url, newSearch])

  return null
}
