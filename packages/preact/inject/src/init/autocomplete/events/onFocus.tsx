import { measure } from "@utils/performance"

import { AutocompleteInjectContext, createUserComponentRenderer } from "../../injectAutocomplete"

export async function onFocus(value: string, context: AutocompleteInjectContext) {
  const { config, renderHistory, history } = context
  const { historyEnabled, minQueryLength } = config
  if (!renderHistory || value.length >= minQueryLength || !historyEnabled || history.isOpen()) {
    return
  }

  const userComponentRenderer = createUserComponentRenderer(context)
  history.show()
  const end = measure("renderHistory")
  userComponentRenderer(renderHistory, history.element)
  end()
}
