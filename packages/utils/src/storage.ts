function setStorage(name: string, value: unknown, storage: Storage) {
  const stringValue = JSON.stringify(value)
  try {
    console.info("Setting storage", name, stringValue)
    storage.setItem(name, stringValue)
  } catch (error) {
    console.warn(error)
  }
}

function getStorage<T>(name: string, storage: Storage) {
  try {
    const dataString = storage.getItem(name)
    if (dataString) {
      return JSON.parse(dataString) as T
    }
  } catch (error) {
    console.warn(error)
  }
}

function removeStorage(name: string, storage: Storage) {
  try {
    storage.removeItem(name)
  } catch (error) {
    console.warn(error)
  }
}

export function setLocalStorageItem(name: string, value: unknown) {
  setStorage(name, value, localStorage)
}

export function setSessionStorageItem(name: string, value: unknown) {
  setStorage(name, value, sessionStorage)
}

export function getLocalStorageItem<T>(name: string) {
  return getStorage<T>(name, localStorage)
}

export function getSessionStorageItem<T>(name: string) {
  return getStorage<T>(name, sessionStorage)
}

export function removeLocalStorageItem(name: string) {
  removeStorage(name, localStorage)
}

export function removeSessionStorageItem(name: string) {
  removeStorage(name, sessionStorage)
}
