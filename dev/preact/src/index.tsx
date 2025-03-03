import "./style.css"

import { createStore, StoreProvider } from "@nosto/search-js/preact"
import { render } from "preact"
import { LocationProvider, Route, Router } from "preact-iso"

import { Header } from "./components/Header"
import { NotFound } from "./pages/404/_404"
import { Home } from "./pages/Home"
import { Search } from "./pages/Search/Search"

export function App() {
  return (
    <StoreProvider store={createStore()}>
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
    </StoreProvider>
  )
}

render(<App />, document.getElementById("app"))
