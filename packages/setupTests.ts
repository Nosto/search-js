import { clearAppendCache } from "@core/withAppend"
import { memoryStorage } from "@utils/storage"
import { afterEach } from "vitest"

afterEach(() => {
  memoryStorage.clear()
  clearAppendCache()
})
