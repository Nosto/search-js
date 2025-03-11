import { useLocation } from "preact-iso"

export function Header() {
  const { url } = useLocation()

  return (
    <header>
      <nav>
        <a href="/" className={url == "/" ? "active" : ""}>
          Home
        </a>
        <a href="/search" className={url == "/search" ? "active" : ""}>
          Search
        </a>
      </nav>
    </header>
  )
}
