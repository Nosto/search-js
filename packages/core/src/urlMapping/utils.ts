export function joinValues(values: string[], separator: string) {
  const separatorEncoded = toURIComponent(separator)
  const re = toRegExp(separator)
  return values.map(v => v.replace(re, separatorEncoded)).join(separator)
}

export function splitValues(encoded: string, separator: string) {
  const separatorEncoded = toURIComponent(separator)
  const re = toRegExp(separatorEncoded)
  return encoded.split(separator).map(v => v.replace(re, separator))
}

export function escape(value: string, separator: string) {
  const separatorEncoded = toURIComponent(separator)
  return value.replace(toRegExp(separator), separatorEncoded)
}

export function unescape(value: string, separator: string) {
  const separatorEncoded = toURIComponent(separator)
  return value.replace(toRegExp(separatorEncoded), separator)
}

function toRegExp(value: string): RegExp {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(escapedValue, "g")
}

function toURIComponent(value: string): string {
  if (value.length > 1) {
    return Array.from(value).map(toURIComponent).join("")
  }
  const code = value.codePointAt(0)
  if (code && code < 0x80) {
    return "%" + code?.toString(16).toUpperCase().padStart(2, "0")
  } else {
    return encodeURIComponent(value)
  }
}
