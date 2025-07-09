import "./style.css"

import { Autocomplete } from "../Autocomplete/Autocomplete"

export function Home() {
  const sections = [
    {
      url: "/category/new-arrivals",
      name: "Old Arrivals",
      description: "[Description]"
    },
    {
      url: "/category",
      name: "Satisfactory Items",
      description: "[Description]"
    },
    {
      url: "/autocomplete",
      name: "Mediocre Goods",
      description: "[Description]"
    }
  ]

  return (
    <div
      className="home"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 48px - 48px)",
        marginTop: "48px",
        paddingTop: "48px 0 0 0"
      }}
    >
      <Autocomplete />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#333" }}>Welcome to Nosto</h1>
          <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            Discover our powerful search and discovery features. Or browse for random products below.
          </p>
        </div>

        <section>
          {sections.map(({ url, name, description }) => (
            <a key={url} href={url} className="resource">
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.3rem" }}>{name}</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: "1.4" }}>{description}</p>
            </a>
          ))}
        </section>
      </div>
    </div>
  )
}
