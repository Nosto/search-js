import { measure } from "@utils/performance"

import { InputEventContext } from "../bindAutocompleteInput"

export async function onFocus(value: string, { config, renderHistory, history, renderComponent }: InputEventContext) {
  const { historyEnabled, minQueryLength } = config
  if (!renderHistory || value.length >= minQueryLength || !historyEnabled || history.isOpen()) {
    return
  }

  history.show()
  const end = measure("renderHistory")
  renderComponent(renderHistory, history.element)
  end()
}
