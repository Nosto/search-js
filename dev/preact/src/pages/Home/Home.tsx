import "./style.css"

import { homeStyles } from "../../Component.styles"
import { Autocomplete } from "../Autocomplete/Autocomplete"

export function Home() {
  return (
    <div className="home" style={homeStyles.container}>
      <Autocomplete />
      <div style={homeStyles.content}>
        <div style={homeStyles.textCenter}>
          <h1 style={homeStyles.heading}>Welcome to Nosto</h1>
          <p style={homeStyles.paragraph}>
            Discover our powerful search and discovery features. Or browse for random categories in the header.
          </p>
        </div>
      </div>
    </div>
  )
}
