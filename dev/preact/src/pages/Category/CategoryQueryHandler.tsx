import { useActions } from "@nosto/search-js/preact/hooks"
import { useEffect } from "preact/hooks"
import { useRoute } from "preact-iso"

export function CategoryQueryHandler() {
  const { newSearch } = useActions()
  const { params } = useRoute()
  const { categoryPath } = params

  // Extract query parameter from URL and perform search
  useEffect(() => {
    if (!categoryPath) {
      return
    }
    newSearch({
      products: {
        categoryPath,
        size: 24
      }
    })
  }, [categoryPath, newSearch])

  return null
}
