const PLATFORM_MAP = {
  h5: 'h5',
  app: 'app',
  'mp-weixin': 'mp-weixin',
  'mp-alipay': 'mp-alipay'
}

let platformCache = ''

export function getPlatform() {
  if (platformCache) {
    return platformCache
  }

  let platform = 'unknown'

  // #ifdef H5
  platform = PLATFORM_MAP.h5
  // #endif
  // #ifdef APP-PLUS
  platform = PLATFORM_MAP.app
  // #endif
  // #ifdef MP-WEIXIN
  platform = PLATFORM_MAP['mp-weixin']
  // #endif
  // #ifdef MP-ALIPAY
  platform = PLATFORM_MAP['mp-alipay']
  // #endif

  platformCache = platform
  return platform
}

export function isH5() {
  return getPlatform() === PLATFORM_MAP.h5
}

export function isApp() {
  return getPlatform() === PLATFORM_MAP.app
}

export function isMpWeixin() {
  return getPlatform() === PLATFORM_MAP['mp-weixin']
}

export function isMpAlipay() {
  return getPlatform() === PLATFORM_MAP['mp-alipay']
}

export function isWechatBrowser() {
  // #ifdef H5
  if (typeof navigator !== 'undefined') {
    return /micromessenger/i.test(navigator.userAgent)
  }
  // #endif

  return false
}

export function getPlatformLabel() {
  const labelMap = {
    [PLATFORM_MAP.h5]: 'H5',
    [PLATFORM_MAP.app]: 'APP',
    [PLATFORM_MAP['mp-weixin']]: '微信小程序',
    [PLATFORM_MAP['mp-alipay']]: '支付宝小程序'
  }

  return labelMap[getPlatform()] || '未知平台'
}

export default {
  getPlatform,
  getPlatformLabel,
  isH5,
  isApp,
  isMpWeixin,
  isMpAlipay,
  isWechatBrowser
}
