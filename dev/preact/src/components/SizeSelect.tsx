import { useSizeOptions } from "@nosto/search-js/preact/hooks"

import { defaultConfig, pageSizes } from "../defaultConfig"

export function PageSizeSelect() {
  const { size, sizeOptions, handleSizeChange } = useSizeOptions(pageSizes, defaultConfig.searchPageSize)

  if (sizeOptions.length === 0) {
    return null
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", margin: "12px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        Show:
        <select value={size} onChange={e => handleSizeChange(Number(e.currentTarget.value))}>
          {sizeOptions.map(v => (
            <option key={v} value={v}>
              {v} items per page
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
