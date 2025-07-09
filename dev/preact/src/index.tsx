import "./style.css"

import { render } from "preact"
import { LocationProvider, Route, Router } from "preact-iso"

import { Header } from "./components/Header"
import { InfiniteScrollProvider } from "./contexts/InfiniteScrollContext"
import { NotFound } from "./pages/404/_404"
import { Category } from "./pages/Category/Category"
import { Home } from "./pages/Home/Home"
import { Search } from "./pages/Search/Search"
import { initNosto } from "./utils/initNosto"

initNosto()

export function App() {
  return (
    <InfiniteScrollProvider>
      <LocationProvider>
        <Header />
        <main>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/category/:categoryPath" component={Category} />
            <Route path="/search" component={Search} />
            <Route default component={NotFound} />
          </Router>
        </main>
      </LocationProvider>
    </InfiniteScrollProvider>
  )
}

render(<App />, document.getElementById("app")!)
