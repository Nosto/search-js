import "./style.css"

import { render } from "preact"
import { LocationProvider, Route, Router } from "preact-iso"

import { Header } from "./components/Header"
import { NotFound } from "./pages/404/_404"
import { Autocomplete } from "./pages/Autocomplete/Autocomplete"
import { Home } from "./pages/Home"
import { Search } from "./pages/Search/Search"
import { initNosto } from "./utils/initNosto"

initNosto()

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/autocomplete" component={Autocomplete} />
          <Route path="/search" component={Search} />
          <Route path="/tts" component={Search} />
          <Route path="/search-infinite" component={() => <Search infinite />} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  )
}

render(<App />, document.getElementById("app")!)
