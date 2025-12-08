/**
 * In-memory implementation of the Storage interface.
 * Used as a fallback when localStorage or sessionStorage is unavailable.
 */
export function createInMemoryStorage(): Storage {
  const store = new Map<string, string>()

  return {
    getItem(key: string): string | null {
      return store.get(key) ?? null
    },
    setItem(key: string, value: string): void {
      store.set(key, value)
    },
    removeItem(key: string): void {
      store.delete(key)
    },
    clear(): void {
      store.clear()
    },
    key(index: number): string | null {
      const keys = Array.from(store.keys())
      return keys[index] ?? null
    },
    get length(): number {
      return store.size
    }
  }
}
