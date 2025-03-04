import "./style.css"

import { createStore, StoreContext } from "@nosto/search-js/preact"
import { render } from "preact"
import { LocationProvider, Route, Router } from "preact-iso"

import { Header } from "./components/Header"
import { NotFound } from "./pages/404/_404"
import { Home } from "./pages/Home"
import { Search } from "./pages/Search/Search"

export function App() {
  return (
    <StoreContext value={createStore()}>
      <LocationProvider>
        <Header />
        <main>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/search" component={Search} />
            <Route default component={NotFound} />
          </Router>
        </main>
      </LocationProvider>
    </StoreContext>
  )
}

render(<App />, document.getElementById("app"))
