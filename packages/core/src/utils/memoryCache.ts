type CacheEntry<T> = {
  data: T
  expiry: number
}

const cache = new Map<string, CacheEntry<unknown>>()

export function getFromCache<T>(key: string): T | undefined {
  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry || Date.now() > entry.expiry) {
    cache.delete(key)
    return undefined
  }
  return entry.data
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs })
}

export function clearCache(): void {
  cache.clear()
}
