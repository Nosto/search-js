import { isbot } from "isbot"

/**
 * Check if the current user agent is a bot
 */
export function isBot() {
  return isbot(navigator.userAgent)
}
