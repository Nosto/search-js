import { useMemo } from "preact/hooks"
import { useLocation } from "preact-iso"

export function Header() {
  const { url: locationUrl } = useLocation()

  const locations = useMemo(
    () => [
      { url: "/", name: "Home" },
      { url: "/search", name: "Search" },
      { url: "/search-infinite", name: "Search with infinite" },
      { url: "/autocomplete", name: "Autocomplete" }
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
