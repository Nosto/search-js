import { findAll } from "@preact/inject/helpers/dom.ts"
import { logger } from "@utils/logger.ts"

export interface DelayOptions {
  /** HTML Selector to observe and wait for */
  selector: string
  /**
   * Timeout in milliseconds, how long to wait for element to get rendered
   * @default 500
   */
  timeout?: number
}
/**
 * Wait for element to appear in DOM using MutationObserver
 * @returns First element it finds
 * @example
 * ```
 * import { waitForElement } from '@nosto/preact'
 *
 * init({
 *     serpRenderDelay: () => {
 *        return waitForElement({
 *          selector: 'script[type="text/x-magento-init"]',
 *          timeout: 1000 //1 second
 *        })
 *     },
 * })
 * ```
 */

export async function waitForElement<T extends Element>({ selector, timeout = 500 }: DelayOptions): Promise<T | void> {
  const elements = await waitForElements({ selector, timeout })
  return elements[0] as T | void
}

/**
 * Wait for element to appear in DOM using MutationObserver
 * @returns Array of elements it finds
 */
export function waitForElements<T extends Element>({ selector, timeout = 500 }: DelayOptions): Promise<T[]> {
  return new Promise(resolve => {
    const elements = findAll<T>(selector)
    if (elements.length > 0) {
      return resolve(elements)
    }

    const observer = new MutationObserver(() => {
      const elements = findAll<T>(selector)
      if (elements.length > 0) {
        observer.disconnect()
        clearTimeout(timer)
        resolve(elements)
      }
    })

    const timer = setTimeout(() => {
      observer.disconnect()
      logger.warn(`Timed out (${timeout}) while waiting for element ${selector}`)
      resolve([])
    }, timeout)

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}
