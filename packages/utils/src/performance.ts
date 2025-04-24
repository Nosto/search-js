const prefix = "nosto.search."

function start(name: string) {
  const fullName = `${prefix}${name}`
  window.performance?.mark(`${fullName}.start`)
}

function end(name: string) {
  const fullName = `${prefix}${name}`
  window.performance?.mark(`${fullName}.end`)
  window.performance?.measure(fullName, `${fullName}.start`, `${fullName}.end`)
}

/**
 * Measure the performance of a function.
 */
export function measure(name: string) {
  start(name)
  return () => end(name)
}
