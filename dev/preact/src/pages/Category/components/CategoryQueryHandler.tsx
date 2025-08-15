import { useActions } from "@nosto/search-js/preact/hooks"
import { useEffect } from "preact/hooks"

type Props = {
  categoryPath: string
}

export function CategoryQueryHandler({ categoryPath }: Props) {
  const { newSearch } = useActions()

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
