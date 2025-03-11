import "./style.css"

import { StoreContext, useNostoAppState } from "@nosto/search-js/preact"
import { useContext } from "preact/hooks"

export function Home() {
  const store = useContext(StoreContext)
  const nostoQuery = useNostoAppState(state => state.query.query)

  const mutateState = () => {
    store.updateState({
      query: {
        query: Math.random().toString(36).substring(7) // Random string
      }
    })
  }

  return (
    <div className="home" style={{ width: "100%" }}>
      <div>Nosto query from context:</div>
      <div>
        <b>{JSON.stringify(nostoQuery)}</b>
      </div>
      <div>
        <button onClick={mutateState}>Mutate state</button>
      </div>
    </div>
  )
}
