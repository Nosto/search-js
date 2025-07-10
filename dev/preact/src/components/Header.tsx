import { useMemo } from "preact/hooks"
import { useLocation } from "preact-iso"

import { useInfiniteScroll } from "../contexts/InfiniteScrollContext"

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
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "2em" }}>
      <nav>
        {locations.map(({ url, name }) => (
          <a key={url} href={url} className={url == locationUrl ? "active" : ""}>
            {name}
          </a>
        ))}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <label htmlFor="infinite-scroll-toggle" style={{ color: "#fff", fontSize: "14px", cursor: "pointer" }}>
          Infinite Scroll
        </label>
        <button
          id="infinite-scroll-toggle"
          onClick={toggleInfiniteScroll}
          style={{
            position: "relative",
            width: "44px",
            height: "24px",
            backgroundColor: isInfiniteScrollEnabled ? "#4ade80" : "#6b7280",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            outline: "none"
          }}
          aria-label={`Toggle infinite scroll ${isInfiniteScrollEnabled ? "off" : "on"}`}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: isInfiniteScrollEnabled ? "22px" : "2px",
              width: "20px",
              height: "20px",
              backgroundColor: "#fff",
              borderRadius: "50%",
              transition: "left 0.2s ease",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
            }}
          />
        </button>
      </div>
    </header>
  )
}
