import { type ComponentChildren, createContext } from "preact"
import { useContext, useState } from "preact/hooks"

interface InfiniteScrollContextType {
  isInfiniteScrollEnabled: boolean
  toggleInfiniteScroll: () => void
}

const InfiniteScrollContext = createContext<InfiniteScrollContextType | null>(null)

interface InfiniteScrollProviderProps {
  children: ComponentChildren
}

export function InfiniteScrollProvider({ children }: InfiniteScrollProviderProps) {
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(false)

  const toggleInfiniteScroll = () => {
    setIsInfiniteScrollEnabled(prev => !prev)
  }

  return (
    <InfiniteScrollContext.Provider
      value={{
        isInfiniteScrollEnabled,
        toggleInfiniteScroll
      }}
    >
      {children}
    </InfiniteScrollContext.Provider>
  )
}

export function useInfiniteScroll() {
  const context = useContext(InfiniteScrollContext)
  if (!context) {
    throw new Error("useInfiniteScroll must be used within an InfiniteScrollProvider")
  }
  return context
}
