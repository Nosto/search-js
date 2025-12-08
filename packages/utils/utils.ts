/** @module utils */
export { type BindElementOptions, bindInput, type InputBindingCallbacks } from "./src/bindInput"
export { cl } from "./src/cl"
export { deepMerge, type Merge, type PlainMerge } from "./src/deepMerge"
export { disableNativeAutocomplete } from "./src/disableNativeAutocomplete"
export { isBot } from "./src/isBot"
export { isEqual } from "./src/isEqual"
export { isPlainObject } from "./src/isPlainObject"
export { logger } from "./src/logger"
export { mergeArrays } from "./src/mergeArrays"
export { parseNumber } from "./src/parseNumber"
export { measure } from "./src/performance"
export { pick } from "./src/pick"
export type { Simplify } from "./src/simplify"
export {
  getLocalStorageItem,
  getSessionStorageItem,
  removeLocalStorageItem,
  removeSessionStorageItem,
  setLocalStorageItem,
  setSessionStorageItem
} from "./src/storage"
export type { Unfreeze } from "./src/types"
export { unique } from "./src/unique"
