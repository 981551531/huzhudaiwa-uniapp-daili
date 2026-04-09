/**
 * 权限与登录状态管理工具
 */

import { STORAGE_KEYS, PAGES } from '@/config/constants.js'

/**
 * 获取 Token
 */
export function getToken() {
  return uni.getStorageSync(STORAGE_KEYS.TOKEN) || ''
}

/**
 * 设置 Token
 */
export function setToken(token, refreshToken) {
  uni.setStorageSync(STORAGE_KEYS.TOKEN, token)
  if (refreshToken) {
    uni.setStorageSync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
  }
}

/**
 * 移除 Token
 */
export function removeToken() {
  uni.removeStorageSync(STORAGE_KEYS.TOKEN)
  uni.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * 判断是否已登录
 */
export function isLoggedIn() {
  return !!getToken()
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  try {
    const info = uni.getStorageSync(STORAGE_KEYS.USER_INFO)
    return info ? (typeof info === 'string' ? JSON.parse(info) : info) : null
  } catch (e) {
    return null
  }
}

/**
 * 设置用户信息
 */
export function setUserInfo(userInfo) {
  uni.setStorageSync(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
}

/**
 * 移除用户信息
 */
export function removeUserInfo() {
  uni.removeStorageSync(STORAGE_KEYS.USER_INFO)
}

/**
 * 登出清理
 */
export function logout() {
  removeToken()
  removeUserInfo()
  uni.reLaunch({ url: PAGES.LOGIN })
}

/**
 * 检查登录状态，未登录则跳转登录页
 * @param {boolean} redirect - 是否记录当前页面用于登录后回跳
 */
export function checkLogin(redirect = true) {
  if (isLoggedIn()) return true

  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  let redirectUrl = ''

  if (redirect && currentPage) {
    redirectUrl = `?redirect=${encodeURIComponent('/' + currentPage.route)}`
  }

  uni.navigateTo({
    url: PAGES.LOGIN + redirectUrl
  })

  return false
}

export default {
  getToken,
  setToken,
  removeToken,
  isLoggedIn,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  logout,
  checkLogin
}
