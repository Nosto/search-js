import { useSwatches } from "@nosto/search-js/preact/hooks"

import { productSwatchesCSS, productSwatchesStyles } from "../../../Component.styles"

type Props = {
  swatches: ReturnType<typeof useSwatches>["swatches"]
  toggleOption: ReturnType<typeof useSwatches>["toggleOption"]
}

export default function ProductSwatches({ swatches, toggleOption }: Props) {
  if (!swatches || swatches.length === 0) {
    return null
  }

  return (
    <div style={productSwatchesStyles.container}>
      <style>{productSwatchesCSS}</style>
      {swatches.map(({ field, options }) => (
        <div key={field} style={productSwatchesStyles.fieldContainer}>
          <div style={productSwatchesStyles.fieldLabel}>{field}</div>
          <div style={productSwatchesStyles.optionsContainer}>
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
                  ...productSwatchesStyles.button,
                  ...(selected ? productSwatchesStyles.buttonSelected : productSwatchesStyles.buttonDefault),
                  ...(unavailable && productSwatchesStyles.buttonDisabled)
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
