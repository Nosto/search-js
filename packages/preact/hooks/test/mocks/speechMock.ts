import { vi } from "vitest"

let useSpeechToText: typeof import("@preact/hooks/useSpeechToText").useSpeechToText

type MockSpeechToTextReturn = {
  useSpeechToText: typeof import("@preact/hooks/useSpeechToText").useSpeechToText
}

export async function mockSpeechToText({
  start: baseStart,
  stop: baseStop
}: {
  start?: () => void
  stop?: () => void
}): Promise<MockSpeechToTextReturn> {
  class MockSpeechRecognition {
    onstart: () => void = () => {}
    onresult: (event: unknown) => void = () => {}
    onerror: (event: unknown) => void = () => {}
    onend: () => void = () => {}
    lang = ""
    interimResults = false

    start() {
      if (baseStart) {
        baseStart()
      }
      this.onstart()
    }

    stop() {
      if (baseStop) {
        baseStop()
      }
      this.onend()
    }
  }

  vi.stubGlobal("SpeechRecognition", MockSpeechRecognition)

  vi.doMock("@preact/hooks/useSpeechToText/utils", async () => {
    const actual = await vi.importActual("@preact/hooks/useSpeechToText/utils")
    return {
      ...actual,
      speechToTextSupported: true,
      SpeechRecognition: MockSpeechRecognition
    }
  })

  useSpeechToText = (await import("@preact/hooks/useSpeechToText")).useSpeechToText

  return {
    useSpeechToText
  }
}
