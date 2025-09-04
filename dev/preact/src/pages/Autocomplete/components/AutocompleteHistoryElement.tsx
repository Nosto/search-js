import { HistoryElement } from "@nosto/search-js/preact/autocomplete"
import { AutocompleteContext } from "@nosto/search-js/preact/inject"
import { useContext } from "preact/hooks"

import { autocompleteHistoryElementCSS, autocompleteHistoryElementStyles } from "../../../Component.styles"

export function AutocompleteHistoryElement({ item, highlighted }: { item: string; highlighted: boolean }) {
  const { handleSubmit } = useContext(AutocompleteContext)

  const onSubmit = () => {
    handleSubmit({ query: item })
  }

  return (
    <HistoryElement key={item} onSubmit={onSubmit}>
      <style>{autocompleteHistoryElementCSS}</style>
      <div
        style={autocompleteHistoryElementStyles.container}
        className={"history-element" + (highlighted ? " highlighted" : "")}
      >
        <div style={autocompleteHistoryElementStyles.name}>{item}</div>
      </div>
    </HistoryElement>
  )
}
