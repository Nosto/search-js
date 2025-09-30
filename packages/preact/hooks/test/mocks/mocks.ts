import { createStore, State } from "@preact/common/store/store"
import * as useActions from "@preact/hooks/useActions"
import { deepMerge } from "@utils/deepMerge"
import * as storage from "@utils/storage"
import { Unfreeze } from "@utils/types"
import { vi } from "vitest"

export function mockStore(state: Partial<State>) {
  return createStore(state)
}

export function resetStore(store: ReturnType<typeof createStore>) {
  store.updateState(deepMerge(store.getInitialState()) as Unfreeze<State>)
}

export function mockActions() {
  const actions = {
    newSearch: vi.fn(),
    updateSearch: vi.fn(),
    toggleProductFilter: vi.fn(),
    replaceFilter: vi.fn(),
    removeAllFilters: vi.fn()
  }
  vi.spyOn(useActions, "useActions").mockImplementation(() => actions)
  return actions
}

export function mockLocalStorage() {
  const storageData = {} as Record<string, string>

  const mockedStorage = {
    get length() {
      return Object.keys(storageData).length
    },
    clear: vi.fn().mockImplementation(() => {
      Object.keys(storageData).forEach(key => delete storageData[key])
    }),
    getItem: vi.fn().mockImplementation((key: string) => {
      return storageData[key] ?? null
    }),
    setItem: vi.fn().mockImplementation((key: string, value: string) => {
      storageData[key] = value
    }),
    key: vi.fn().mockImplementation((index: number) => {
      const keys = Object.keys(storageData)
      return keys[index] ?? null
    }),
    removeItem: vi.fn().mockImplementation((key: string) => {
      delete storageData[key]
    })
  } satisfies Storage

  // Hooks into vitest's clearAllMocks
  const clearSpy = vi.fn()
  clearSpy.mockClear = () => {
    Object.keys(storageData).forEach(key => delete storageData[key])
    return clearSpy
  }

  vi.spyOn(storage, "getLocalStorageItem").mockImplementation(name => {
    return storage.getStorageItem(name, mockedStorage)
  })
  vi.spyOn(storage, "setLocalStorageItem").mockImplementation((name, value) => {
    return storage.setStorageItem(name, value, mockedStorage)
  })
  vi.spyOn(storage, "removeLocalStorageItem").mockImplementation(name => {
    return storage.removeStorageItem(name, mockedStorage)
  })

  return mockedStorage
}
