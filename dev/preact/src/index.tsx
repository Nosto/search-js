import "./style.css"

import { render } from "preact"
import { LocationProvider, Route, Router } from "preact-iso"

import { Header } from "./components/Header"
import { UserPreferencesProvider } from "./contexts/InfiniteScrollContext"
import { NotFound } from "./pages/404/_404"
import { Category } from "./pages/Category/Category"
import { CategoryInject } from "./pages/Category/CategoryInjected"
import { Home } from "./pages/Home/Home"
import { Search } from "./pages/Search/Search"
import { initNosto } from "./utils/initNosto"

initNosto()

export function App() {
  return (
    <UserPreferencesProvider>
      <LocationProvider>
        <Header />
        <main>
          <Router>
            <Route path="/" component={Home} />
            <Route path="/category/:categoryPath" component={Category} />
            <Route path="/inject/category/:categoryPath" component={CategoryInject} />
            <Route path="/search" component={Search} />
            <Route default component={NotFound} />
          </Router>
        </main>
      </LocationProvider>
    </UserPreferencesProvider>
  )
}

render(<App />, document.getElementById("app")!)
