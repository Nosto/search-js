import { isBot } from "@utils/isBot"
import { describe, expect, it } from "vitest"

function mockUserAgent(userAgent: string) {
  // @ts-expect-error: global.navigator is incomplete
  global.navigator = { userAgent }
}

export const botUserAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

export const nonBotUserAgent =
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"

describe("isBot", () => {
  it("detects non-bots", () => {
    mockUserAgent(nonBotUserAgent)
    expect(isBot()).toBe(false)
  })

  it("detects bots", () => {
    mockUserAgent(botUserAgent)
    expect(isBot()).toBe(true)
  })
})
