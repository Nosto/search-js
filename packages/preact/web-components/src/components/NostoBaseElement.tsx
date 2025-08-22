import { parseNumber } from "@utils/parseNumber"
import { render } from "preact"

import { NostoWebComponentConfig } from "../types"

/**
 * Base class for all Nosto web components
 */
export abstract class NostoBaseElement extends HTMLElement {
  protected _config: Partial<NostoWebComponentConfig> = {}
  protected _mounted = false

  constructor() {
    super()
  }

  connectedCallback() {
    if (!this._mounted) {
      this._parseAttributes()
      this._render()
      this._mounted = true
    }
  }

  disconnectedCallback() {
    render(null, this)
    this._mounted = false
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue && this._mounted) {
      this._parseAttributes()
      this._render()
    }
  }

  /**
   * Parse component attributes into configuration
   */
  protected _parseAttributes() {
    this._config = {
      accountId: this.getAttribute("account-id") || "",
      defaultCurrency: this.getAttribute("default-currency") || "EUR",
      searchUrl: this.getAttribute("search-url") || undefined,
      search: {
        products: {
          limit: parseNumber(this.getAttribute("limit")) || 24,
          fields: this.getAttribute("fields")?.split(",") || undefined
        },
        redirect: this.hasAttribute("redirect") && this.getAttribute("redirect") !== "false"
      }
    }
  }

  /**
   * Dispatch a custom event with the nosto:search-js prefix
   */
  protected _dispatchNostoEvent(eventType: string, detail: unknown) {
    const event = new CustomEvent(eventType, {
      detail,
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(event)
    // Also dispatch on document for global listeners
    document.dispatchEvent(event)
  }

  /**
   * Listen for Nosto events
   */
  protected _listenForNostoEvent(eventType: string, handler: (event: CustomEvent) => void) {
    const listener = (event: Event) => handler(event as CustomEvent)
    document.addEventListener(eventType, listener)
    return () => document.removeEventListener(eventType, listener)
  }

  /**
   * Get the current configuration
   */
  get config(): Partial<NostoWebComponentConfig> {
    return { ...this._config }
  }

  /**
   * Render the component - must be implemented by subclasses
   */
  protected abstract _render(): void

  /**
   * Get the list of observed attributes
   */
  static get observedAttributes(): string[] {
    return ["account-id", "default-currency", "search-url", "limit", "fields", "redirect"]
  }
}
