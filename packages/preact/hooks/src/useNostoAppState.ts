import { State } from "@preact/common/store/store"
import { StoreContext } from "@preact/common/store/storeContext"
import { useContext, useEffect, useState } from "preact/hooks"

/**
 * Imports a part of the Nosto state to the component.
 *
 * @example
 * ```jsx
 * import { useNostoAppState } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *     const pageType = useNostoAppState(state => state.pageType)
 *
 *     return (
 *       <div>
 *         Page type is {pageType}
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
 * import { useNostoAppState } from '@nosto/search-js/preact/hooks'
 *
 * export default () => {
 *     const state = useNostoAppState()
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
export function useNostoAppState(): State
export function useNostoAppState<Selected>(selector: (state: State) => Selected): Selected
export function useNostoAppState<Selected>(selector: (state: State) => Selected = fullStateSelector<Selected>) {
  const store = useContext(StoreContext)
  const [slice, setSlice] = useState(selector(store.getState()))
  store.onChange(selector, setSlice)
  useEffect(() => {
    return () => store.clearOnChange(setSlice)
  }, [store])
  return slice
}

const fullStateSelector = <Selected>(state: State) => state as Selected
