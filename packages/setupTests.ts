import { clearAppendCache } from "@core/withAppend"
import { afterEach } from "vitest"

afterEach(() => {
  clearAppendCache()
})
