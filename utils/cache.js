const CACHE_PREFIX = 'app_cache:'

function getCacheKey(key) {
  return `${CACHE_PREFIX}${key}`
}

function normalizeTtl(ttl) {
  return Number.isFinite(ttl) && ttl > 0 ? ttl : 0
}

function createCachePayload(value, ttl = 0) {
  const expiresAt = normalizeTtl(ttl) ? Date.now() + ttl : 0
  return {
    value,
    expiresAt
  }
}

function isExpired(payload) {
  return !!payload?.expiresAt && payload.expiresAt <= Date.now()
}

function safeParse(value) {
  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

export function setCache(key, value, ttl = 0) {
  const cacheKey = getCacheKey(key)
  const payload = createCachePayload(value, ttl)
  uni.setStorageSync(cacheKey, JSON.stringify(payload))
  return payload
}

export function getCache(key, defaultValue = null) {
  const cacheKey = getCacheKey(key)
  const rawValue = uni.getStorageSync(cacheKey)

  if (!rawValue) {
    return defaultValue
  }

  const parsedValue = safeParse(rawValue)
  if (!parsedValue || typeof parsedValue !== 'object' || !('value' in parsedValue)) {
    return parsedValue ?? defaultValue
  }

  if (isExpired(parsedValue)) {
    uni.removeStorageSync(cacheKey)
    return defaultValue
  }

  return parsedValue.value
}

export function removeCache(key) {
  uni.removeStorageSync(getCacheKey(key))
}

export function hasCache(key) {
  const cacheKey = getCacheKey(key)
  const rawValue = uni.getStorageSync(cacheKey)

  if (!rawValue) {
    return false
  }

  const parsedValue = safeParse(rawValue)
  if (!parsedValue || typeof parsedValue !== 'object' || !('value' in parsedValue)) {
    return true
  }

  if (isExpired(parsedValue)) {
    uni.removeStorageSync(cacheKey)
    return false
  }

  return true
}

export function getExpireTime(key) {
  const rawValue = uni.getStorageSync(getCacheKey(key))
  const parsedValue = safeParse(rawValue)
  return parsedValue?.expiresAt || 0
}

export function clearCache(prefix = '') {
  const storageInfo = uni.getStorageInfoSync()
  const targetPrefix = getCacheKey(prefix)

  storageInfo.keys
    .filter((key) => key.startsWith(targetPrefix))
    .forEach((key) => {
      uni.removeStorageSync(key)
    })
}

export default {
  setCache,
  getCache,
  removeCache,
  hasCache,
  getExpireTime,
  clearCache
}
