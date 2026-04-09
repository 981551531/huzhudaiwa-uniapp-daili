import { PAGES } from '@/config/constants.js'
import { isLoggedIn } from './auth.js'
import { setCache, getCache, removeCache } from './cache.js'

const ROUTER_RESULT_PREFIX = 'router_result:'
const TAB_BAR_PAGES = new Set([PAGES.HOME])

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function ensureLeadingSlash(url = '') {
  if (!url) {
    return ''
  }

  return url.startsWith('/') ? url : `/${url}`
}

export function stringifyQuery(params = {}) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

export function buildUrl(url, params = {}) {
  const nextUrl = ensureLeadingSlash(url)
  const queryString = stringifyQuery(params)

  if (!queryString) {
    return nextUrl
  }

  return `${nextUrl}${nextUrl.includes('?') ? '&' : '?'}${queryString}`
}

export function parseQuery(queryString = '') {
  const source = queryString.includes('?') ? queryString.split('?')[1] : queryString

  return source
    .split('&')
    .filter(Boolean)
    .reduce((result, item) => {
      const [rawKey, rawValue = ''] = item.split('=')
      result[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue)
      return result
    }, {})
}

function getCurrentRoute() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage ? ensureLeadingSlash(currentPage.route) : ''
}

function isTabBarPage(url) {
  const pathname = ensureLeadingSlash(url).split('?')[0]
  return TAB_BAR_PAGES.has(pathname)
}

function navigate(method, url, params = {}, options = {}) {
  const nextUrl = buildUrl(url, params)

  return new Promise((resolve, reject) => {
    uni[method]({
      url: nextUrl,
      animationType: options.animationType,
      animationDuration: options.animationDuration,
      success: resolve,
      fail: reject
    })
  })
}

export function go(url, params = {}, options = {}) {
  if (options.relaunch) {
    return relaunch(url, params, options)
  }

  if (options.replace) {
    return replace(url, params, options)
  }

  if (options.switchTab || isTabBarPage(url)) {
    return switchTab(url, params)
  }

  return push(url, params, options)
}

export function push(url, params = {}, options = {}) {
  return navigate('navigateTo', url, params, options)
}

export function replace(url, params = {}, options = {}) {
  return navigate('redirectTo', url, params, options)
}

export function switchTab(url, params = {}) {
  const nextUrl = buildUrl(url, params)

  return new Promise((resolve, reject) => {
    uni.switchTab({
      url: nextUrl,
      success: resolve,
      fail: reject
    })
  })
}

export function relaunch(url, params = {}, options = {}) {
  return navigate('reLaunch', url, params, options)
}

export function toLogin(redirect = true) {
  const redirectUrl = redirect ? getCurrentRoute() : ''
  const params = redirectUrl ? { redirect: redirectUrl } : {}
  return relaunch(PAGES.LOGIN, params)
}

export function withLogin(fn, fallback) {
  if (isLoggedIn()) {
    return typeof fn === 'function' ? fn() : Promise.resolve(true)
  }

  toLogin(true)
  if (typeof fallback === 'function') {
    fallback()
  }

  return Promise.resolve(false)
}

function getResultCacheKey(route) {
  return `${ROUTER_RESULT_PREFIX}${route}`
}

export function setPageResult(route, data, ttl = 1000 * 60) {
  if (!route) {
    return
  }

  setCache(getResultCacheKey(route), data, ttl)
}

export function consumePageResult(route, defaultValue = null) {
  if (!route) {
    return defaultValue
  }

  const cacheKey = getResultCacheKey(route)
  const result = getCache(cacheKey, defaultValue)
  removeCache(cacheKey)
  return result
}

export function back(delta = 1, result) {
  const pages = getCurrentPages()
  const targetPage = pages[pages.length - 1 - delta]
  if (targetPage && result !== undefined) {
    setPageResult(ensureLeadingSlash(targetPage.route), result)
  }

  return new Promise((resolve, reject) => {
    uni.navigateBack({
      delta,
      success: resolve,
      fail: reject
    })
  })
}

export function getRouteQuery(options = {}) {
  if (isObject(options) && Object.keys(options).length > 0) {
    return options
  }

  return {}
}

export default {
  stringifyQuery,
  buildUrl,
  parseQuery,
  go,
  push,
  replace,
  switchTab,
  relaunch,
  back,
  toLogin,
  withLogin,
  setPageResult,
  consumePageResult,
  getRouteQuery
}
