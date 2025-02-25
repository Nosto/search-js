import { State } from "@preact/store"
import { StoreContext } from "@preact/storeContext"
import { useContext, useEffect, useState } from "preact/hooks"

/**
 * Imports a part of the Nosto state to the component.
 *
 * @example
 * ```jsx
 * import { useNostoState } from '@nosto/search-js/preact'
 *
 * export default () => {
 *     const pageType = useNostoState(state => state.pageType)
 *
 *     return (
 *       <div>
 *         Page type is {pageTypey}
 *       </div>
 *     )
 * }
 * ```
 *
 * If the selector parameter is not provided, the full state is returned.
 * Be mindful of the unnecessary rerenders it may cause.
 *
 * @example
 * ```jsx
 * import { useNostoState } from '@nosto/search-js/preact'
 *
 * export default () => {
 *     const state = useNostoState()
 *
 *     return (
 *       <div>
 *         Page type is {state.pageType}
 *       </div>
 *     )
 * }
 * ```
 *
 * @group Hooks
 */
export function useNostoState<Selected>(selector: (state: State) => Selected = fullStateSelector<Selected>): Selected {
  const store = useContext(StoreContext)
  const [slice, setSlice] = useState(selector(store.getState()))
  store.onChange(selector, setSlice)
  useEffect(() => {
    return () => store.clearOnChange(setSlice)
  }, [store])
  return slice
}

const fullStateSelector = <Selected>(state: State) => state as Selected
