import { HistoryElement } from "@nosto/search-js/preact/autocomplete"
import { useActions } from "@nosto/search-js/preact/hooks"

import { historyElementStyles, styles } from "./AutocompleteHistoryElement.styles"

export function AutocompleteHistoryElement({ item, highlighted }: { item: string; highlighted: boolean }) {
  const { newSearch } = useActions()

  const onSubmit = () => {
    newSearch({ query: item })
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
