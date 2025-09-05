import "./style.css"

import { Autocomplete } from "../Autocomplete/Autocomplete"
import { styles } from "./Home.styles"

export function Home() {
  return (
    <div className="home" style={styles.home}>
      <Autocomplete />
      <div style={styles.content}>
        <div style={styles.centerContent}>
          <h1 style={styles.title}>Welcome to Nosto</h1>
          <p style={styles.description}>
            Discover our powerful search and discovery features. Or browse for random categories in the header.
          </p>
        </div>
      </div>
    </div>
  )
}
