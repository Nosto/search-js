import { useEffect } from "preact/hooks"

export function useEffectOnce(effect: () => void) {
  useEffect(() => {
    effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
