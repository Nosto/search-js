import { useSwatches } from "@nosto/search-js/preact/hooks"

type Props = {
  swatches: ReturnType<typeof useSwatches>["swatches"]
  toggleOption: ReturnType<typeof useSwatches>["toggleOption"]
}

export default function ProductSwatches({ swatches, toggleOption }: Props) {
  if (!swatches || swatches.length === 0) {
    return
  }

  return (
    <div>
      {swatches.map(({ field, options }) => (
        <div key={field}>
          <div>
            {options.map(({ value, unavailable, selected }) => (
              <button
                key={value}
                onClick={e => {
                  e.preventDefault()
                  toggleOption(field, value)
                }}
                disabled={unavailable}
                style={{
                  margin: "5px",
                  background: selected ? "#0073e6" : "#f5f5f5",
                  color: selected ? "#ffffff" : "#000000",
                  opacity: unavailable ? 0.2 : 1
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
