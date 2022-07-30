const map = new Map<string, { timeout: any; thresholdMs: number | void; startTime: number }>()

export const time = (label: string, thresholdMs?: number) => {
  if (map.has(label)) {
    console.warn(`Timer '${label}' already exists`)
  } else {
    map.set(label, {
      timeout: setTimeout(
        () => {
          console.warn(`Timer '${label}' took too long`)
          map.delete(label)
        },
        1000 * 60 * 10
      ),
      startTime: performance.now(),
      thresholdMs,
    })
  }
}

export const timeEnd = (label: string) => {
  const now = performance.now()
  if (!map.has(label)) {
    console.warn(`Timer '${label}' does not exist`)
  } else {
    const { timeout, startTime, thresholdMs } = map.get(label)!
    clearTimeout(timeout)
    map.delete(label)
    const duration = now - startTime
    if (thresholdMs) {
      if (duration > thresholdMs) {
        console.warn(`Timer '${label}' too slow: ${duration} ms (threshold: ${thresholdMs} ms)`)
      }
    } else {
      console.log(`${label}: ${duration} ms`)
    }
  }
}
