import { useSwatches } from "@nosto/search-js/preact/hooks"

import { styles, swatchButtonStyles } from "./ProductSwatches.styles"

type Props = {
  swatches: ReturnType<typeof useSwatches>["swatches"]
  toggleOption: ReturnType<typeof useSwatches>["toggleOption"]
}

export default function ProductSwatches({ swatches, toggleOption }: Props) {
  if (!swatches || swatches.length === 0) {
    return null
  }

  return (
    <div style={styles.container}>
      <style>{swatchButtonStyles}</style>
      {swatches.map(({ field, options }) => (
        <div key={field} style={styles.fieldContainer}>
          <div style={styles.fieldLabel}>{field}</div>
          <div style={styles.optionsContainer}>
            {options.map(({ value, unavailable, selected }) => (
              <button
                key={value}
                onClick={e => {
                  e.preventDefault()
                  toggleOption(field, value)
                }}
                disabled={unavailable}
                className={`swatch-button ${selected ? "selected" : ""}`}
                style={{
                  ...styles.button,
                  ...(selected ? styles.buttonSelected : styles.buttonDefault),
                  ...(unavailable && styles.buttonDisabled)
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
