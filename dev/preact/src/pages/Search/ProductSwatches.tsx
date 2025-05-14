import { SearchProduct } from "@nosto/nosto-js/client"
import { useSwatches } from "@nosto/search-js/preact/hooks"

export default function ProductSwatches({ skus = [] }: SearchProduct) {
  const { swatches, toggleOption, matchedSkus } = useSwatches(skus, ["color", "size", "material"])

  if (!swatches || swatches.length === 0) {
    return
  }

  const handleAddToCart = () => {
    const skuToAdd = matchedSkus[0]
    console.log(skuToAdd)
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
      {matchedSkus.length === 1 && <button onClick={handleAddToCart}>Add to Cart</button>}
    </div>
  )
}
