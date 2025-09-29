import { logger } from "./logger"

type Key = `nosto:search-js:${string}`

export function setStorageItem(name: Key, value: unknown, storage: Storage) {
  const stringValue = JSON.stringify(value)
  try {
    storage.setItem(name, stringValue)
  } catch (error) {
    logger.warn(error)
  }
}

export function getStorageItem<T>(name: Key, storage: Storage) {
  try {
    const dataString = storage.getItem(name)
    if (dataString) {
      return JSON.parse(dataString) as T
    }
  } catch (error) {
    logger.warn(error)
  }
}

export function removeStorageItem(name: Key, storage: Storage) {
  try {
    storage.removeItem(name)
  } catch (error) {
    logger.warn(error)
  }
}

export function setLocalStorageItem(name: Key, value: unknown) {
  setStorageItem(name, value, localStorage)
}

export function setSessionStorageItem(name: Key, value: unknown) {
  setStorageItem(name, value, sessionStorage)
}

export function getLocalStorageItem<T>(name: Key) {
  return getStorageItem<T>(name, localStorage)
}

export function getSessionStorageItem<T>(name: Key) {
  return getStorageItem<T>(name, sessionStorage)
}

export function removeLocalStorageItem(name: Key) {
  removeStorageItem(name, localStorage)
}

export function removeSessionStorageItem(name: Key) {
  removeStorageItem(name, sessionStorage)
}
