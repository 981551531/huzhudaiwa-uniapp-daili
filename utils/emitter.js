const eventMap = new Map()

function getListeners(event) {
  if (!eventMap.has(event)) {
    eventMap.set(event, new Set())
  }

  return eventMap.get(event)
}

export function on(event, handler) {
  if (!event || typeof handler !== 'function') {
    return () => undefined
  }

  const listeners = getListeners(event)
  listeners.add(handler)

  return () => off(event, handler)
}

export function once(event, handler) {
  if (typeof handler !== 'function') {
    return () => undefined
  }

  const wrappedHandler = (...args) => {
    off(event, wrappedHandler)
    handler(...args)
  }

  return on(event, wrappedHandler)
}

export function off(event, handler) {
  const listeners = eventMap.get(event)
  if (!listeners) {
    return
  }

  if (!handler) {
    eventMap.delete(event)
    return
  }

  listeners.delete(handler)
  if (!listeners.size) {
    eventMap.delete(event)
  }
}

export function emit(event, ...args) {
  const listeners = eventMap.get(event)
  if (!listeners?.size) {
    return
  }

  listeners.forEach((handler) => {
    handler(...args)
  })
}

export function clearEvents() {
  eventMap.clear()
}

export default {
  on,
  once,
  off,
  emit,
  clearEvents
}
