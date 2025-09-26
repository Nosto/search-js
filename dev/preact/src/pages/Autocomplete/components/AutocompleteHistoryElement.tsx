import { HistoryElement } from "@nosto/search-js/preact/autocomplete"

import { historyElementStyles, styles } from "./AutocompleteHistoryElement.styles"

export function AutocompleteHistoryElement({ item, highlighted }: { item: string; highlighted: boolean }) {
  return (
    <HistoryElement key={item} onSubmit={() => {}}>
      <style>{historyElementStyles}</style>
      <div style={styles.container} className={"history-element" + (highlighted ? " highlighted" : "")}>
        <div style={styles.name}>{item}</div>
      </div>
    </HistoryElement>
  )
}
