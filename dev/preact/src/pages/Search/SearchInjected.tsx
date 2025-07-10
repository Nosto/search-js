import { init } from "@nosto/search-js/inject"

import { Autocomplete } from "../Autocomplete/Autocomplete"

export function SearchInjected() {
  // TODO: Actually inject from here
  init({
    serp: {
      contentSelector: "#inject-search"
    }
  })

  return (
    <div
      className="search"
      title="Search (Injected)"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "calc(100vh - 48px - 14px)",
        marginTop: "14px"
      }}
    >
      <Autocomplete />
      <span>Injected search will be here</span>
      <div id="inject-search" />
    </div>
  )
}
