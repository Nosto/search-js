import { HistoryElement } from "@nosto/search-js/preact/autocomplete"

import { historyElementStyles, styles } from "./AutocompleteHistoryElement.styles"

export function AutocompleteHistoryElement({ item, highlighted }: { item: string; highlighted: boolean }) {
  const onSubmit = () => {
    // In native mode, the HistoryElement handles navigation automatically
    // We just need to handle the submit action which navigates to search
    if (window.location.pathname.startsWith("/search")) {
      // Update the current search if we're already on search page
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set("q", item)
      window.history.pushState({}, "", `${window.location.pathname}?${searchParams}`)
      window.dispatchEvent(new PopStateEvent("popstate"))
    } else {
      // Navigate to search page
      window.location.href = `/search/?q=${item}`
    }
  }

  return (
    <HistoryElement key={item} onSubmit={onSubmit}>
      <style>{historyElementStyles}</style>
      <div style={styles.container} className={"history-element" + (highlighted ? " highlighted" : "")}>
        <div style={styles.name}>{item}</div>
      </div>
    </HistoryElement>
  )
}
