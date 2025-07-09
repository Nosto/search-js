import { useMemo } from "preact/hooks"
import { useLocation } from "preact-iso"

export function Header() {
  const { path: locationUrl } = useLocation()

  const locations = useMemo(
    () => [
      { url: "/", name: "Home" },
      { url: "/search", name: "Search" },
      { url: "/category/tops", name: "Tops" },
      { url: "/category/skirts", name: "Skirts" },
      { url: "/category/dresses", name: "Dresses" },
      { url: "/category/sale", name: "Sale" }
    ],
    []
  )

  return (
    <header>
      <nav>
        {locations.map(({ url, name }) => (
          <a key={url} href={url} className={url == locationUrl ? "active" : ""}>
            {name}
          </a>
        ))}
      </nav>
    </header>
  )
}
