import { useCallback } from "preact/hooks"

import { AllowedEvents, EventParams } from "./types"

type Props<T extends AllowedEvents> = {
  event: T
}

export const dispatchNostoEvent = <T extends AllowedEvents>({
  event,
  params
}: {
  event: T
  params: EventParams[T]
}) => {
  window.dispatchEvent(
    new CustomEvent(`@nosto/search-js/${event}`, {
      detail: params
    })
  )
}

export const useEventBusDispatch = <T extends AllowedEvents>({ event }: Props<T>) => {
  return useCallback(
    (params: EventParams[T]) => {
      dispatchNostoEvent({ event, params })
    },
    [event]
  )
}
