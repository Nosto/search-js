import { useLocation } from "preact-iso"

export function Header() {
  const { url } = useLocation()

  return (
    <header>
      <nav>
        <a href="/" class={url == "/" ? "active" : ""}>
          Home
        </a>
        <a href="/search" class={url == "/search" ? "active" : ""}>
          Search
        </a>
      </nav>
    </header>
  )
}
