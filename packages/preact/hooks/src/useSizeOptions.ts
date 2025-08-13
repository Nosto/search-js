import { parseNumber } from "@utils/parseNumber"
import { useCallback, useMemo } from "preact/hooks"

import { useActions } from "./useActions"
import { useNostoAppState } from "./useNostoAppState"

function normalize(value: number) {
  return value && !Number.isNaN(value) ? value : 0
}

/**
 * Preact hook that provides size options to the component.
 * @param sizes
 * @param serpSize
 * @example
 * ```jsx
 * import { useSizeOptions } from "@nosto/search-js/preact/hooks"
 * import { defaultConfig, sizes } from "../config"
 *
 * export default () => {
 *   const options = useSizeOptions(sizes, defaultConfig.serpSize)
 *   const { from, to, total, size, sizeOptions, handleSizeChange } = options
 *
 *   return (
 *    <div>
 *      <div>
 *        {from} - {total < to ? total : to} of {total} items
 *      </div>
 *       {sizeOptions.length > 0 && (
 *        <div>
 *          <select
 *            value={size}
 *            onChange={e => handleSizeChange(e.target.value)}
 *          >
 *            {sizeOptions.map(v => (
 *              <option value={v}>{v} items per page</option>
 *            ))}
 *          </select>
 *        </div>
 *      )}
 *    </div>
 *    )
 * }
 * ```
 * @group Hooks
 */
export function useSizeOptions(sizes: number[], serpSize: number) {
  const { from, size, total } = useNostoAppState(state => ({
    from: normalize(state.query.products?.from ?? 0),
    size: normalize(state.response?.products?.size ?? serpSize),
    total: normalize(state.response?.products?.total ?? 0)
  }))

  const { updateSearch } = useActions()

  const to = useMemo(() => from + size, [from, size])

  const sizeOptions = useMemo(() => [...sizes].reverse().filter(value => value < total), [sizes, total])

  const handleSizeChange = useCallback(
    (size: number) => {
      updateSearch({
        products: {
          size: parseNumber(size)
        }
      })
    },
    [updateSearch]
  )

  return useMemo(
    () => ({
      /** from value */
      from,
      /** to value */
      to,
      /** total value */
      total,
      /** size value */
      size,
      /** Array of size options */
      sizeOptions,
      /** Should be called when size is changed */
      handleSizeChange
    }),
    [from, to, total, size, sizeOptions, handleSizeChange]
  )
}
