import "./style.css"

import { Autocomplete } from "../Autocomplete/Autocomplete"

export function Home() {
  return (
    <div
      className="home"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <Autocomplete />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#333" }}>Welcome to Nosto</h1>
          <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
            Discover our powerful search and discovery features. Or browse for random categories in the header.
          </p>
        </div>
      </div>
    </div>
  )
}
