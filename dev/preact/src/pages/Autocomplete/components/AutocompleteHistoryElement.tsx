import { HistoryElement } from "@nosto/search-js/preact/autocomplete"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

import { historyElementStyles, styles } from "./AutocompleteHistoryElement.styles"

export function AutocompleteHistoryElement({ item, highlighted }: { item: string; highlighted: boolean }) {
  const { handleSubmit } = useContext(AutocompleteContext)

  const onSubmit = () => {
    handleSubmit({ query: item })
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
