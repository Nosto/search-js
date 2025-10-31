import { useMemo } from "preact/hooks"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../contexts/InfiniteScrollContext"
import { Button } from "./Button"
import { getButtonStyle, styles } from "./Header.styles"

export function Header() {
  const { path: locationUrl } = useLocation()
  const { isInfiniteScrollEnabled, toggleInfiniteScroll } = useInfiniteScroll()

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
    <header style={styles.header}>
      <nav>
        {locations.map(({ url, name }) => (
          <a key={url} href={url} className={url == locationUrl ? "active" : ""}>
            {name}
          </a>
        ))}
      </nav>
      <div style={styles.buttonContainer}>
        <Button onClick={toggleInfiniteScroll} style={getButtonStyle(isInfiniteScrollEnabled, "green")}>
          {isInfiniteScrollEnabled ? "🟢" : "⚪"}
          <span> Infinite Scroll</span>
        </Button>
      </div>
    </header>
  )
}
