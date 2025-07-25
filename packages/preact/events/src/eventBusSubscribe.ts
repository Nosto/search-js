import { useCallback, useEffect } from "preact/hooks"

import { AllowedEvents, EventParams } from "./types"

type Props<T extends AllowedEvents> = {
  event: T
  callback: (params: EventParams[T]) => void
}

export const subscribeToNostoEvent = <T extends AllowedEvents>({ event, callback }: Props<T>) => {
  const onEvent = ((event: CustomEvent) => {
    const params = event.detail as EventParams[T]
    callback(params)
  }) as EventListener

  window.addEventListener(`@nosto/search-js/${event}`, onEvent)
  return () => {
    window.removeEventListener(`@nosto/search-js/${event}`, onEvent)
  }
}

export const useEventBusSubscribe = <T extends AllowedEvents>({ event, callback }: Props<T>) => {
  const onEvent = useCallback(
    (event: CustomEvent) => {
      const params = event.detail as EventParams[T]
      callback(params)
    },
    [callback]
  ) as EventListener

  useEffect(() => {
    window.addEventListener(`@nosto/search-js/${event}`, onEvent)
    return () => {
      window.removeEventListener(`@nosto/search-js/${event}`, onEvent)
    }
  }, [event, onEvent])
}
