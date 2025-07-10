import { useMemo } from "preact/hooks"
import { useLocation } from "preact-iso"

import { useInfiniteScroll, useInjectionLogic } from "../contexts/InfiniteScrollContext"
import { Button } from "./Button"

export function Header() {
  const { path: locationUrl } = useLocation()
  const { isInfiniteScrollEnabled, toggleInfiniteScroll } = useInfiniteScroll()
  const { isInjectionEnabled, toggleInjection } = useInjectionLogic()

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
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Button
          onClick={toggleInfiniteScroll}
          style={{
            padding: "8px 16px",
            border: isInfiniteScrollEnabled ? "1px solid #22c55e" : "1px solid #6b7280",
            outline: isInfiniteScrollEnabled ? "1px solid #22c55e" : "1px solid #00000000",
            boxShadow: isInfiniteScrollEnabled
              ? "0 2px 8px rgba(34, 197, 94, 0.15)"
              : "0 2px 8px rgba(107, 114, 128, 0.15)"
          }}
        >
          {isInfiniteScrollEnabled ? "🟢" : "⚪"}
          <span> Infinite Scroll</span>
        </Button>
        <Button
          onClick={toggleInjection}
          style={{
            padding: "8px 16px",
            border: isInjectionEnabled ? "1px solid #22c55e" : "1px solid #6b7280",
            outline: isInjectionEnabled ? "1px solid #22c55e" : "1px solid #00000000",
            boxShadow: isInjectionEnabled ? "0 2px 8px rgba(99, 102, 241, 0.15)" : "0 2px 8px rgba(107, 114, 128, 0.15)"
          }}
        >
          {isInjectionEnabled ? "🟢" : "⚪"}
          <span> Injection</span>
        </Button>
      </div>
    </header>
  )
}
