import { getPlatform } from './platform.js'

let systemInfoCache = null

export function getSystemInfo() {
  if (systemInfoCache) {
    return systemInfoCache
  }

  try {
    systemInfoCache = uni.getSystemInfoSync()
  } catch (error) {
    systemInfoCache = {}
  }

  return systemInfoCache
}

export function clearSystemInfoCache() {
  systemInfoCache = null
}

export function getStatusBarHeight() {
  return getSystemInfo().statusBarHeight || 0
}

export function getNavbarHeight() {
  const statusBarHeight = getStatusBarHeight()

  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect()
  return statusBarHeight + (menuButton.top - statusBarHeight) * 2 + menuButton.height
  // #endif

  return statusBarHeight + 44
}

export function getSafeAreaInsets() {
  const safeAreaInsets = getSystemInfo().safeAreaInsets || {}
  return {
    top: safeAreaInsets.top || 0,
    right: safeAreaInsets.right || 0,
    bottom: safeAreaInsets.bottom || 0,
    left: safeAreaInsets.left || 0
  }
}

export function getWindowSize() {
  const systemInfo = getSystemInfo()
  return {
    width: systemInfo.windowWidth || 0,
    height: systemInfo.windowHeight || 0
  }
}

export function getDeviceInfo() {
  const systemInfo = getSystemInfo()

  return {
    brand: systemInfo.brand || '',
    model: systemInfo.model || '',
    system: systemInfo.system || '',
    platform: getPlatform(),
    pixelRatio: systemInfo.pixelRatio || 1
  }
}

export function rpxToPx(rpx) {
  const { width } = getWindowSize()
  return (Number(rpx) / 750) * width
}

export function pxToRpx(px) {
  const { width } = getWindowSize()
  return width ? (Number(px) / width) * 750 : 0
}

export default {
  getSystemInfo,
  clearSystemInfoCache,
  getStatusBarHeight,
  getNavbarHeight,
  getSafeAreaInsets,
  getWindowSize,
  getDeviceInfo,
  rpxToPx,
  pxToRpx
}
