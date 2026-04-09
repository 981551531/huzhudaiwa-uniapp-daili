/**
 * 常用工具方法集合
 */

import dayjs from 'dayjs'

// ==================== 数据类型判断 ====================

/**
 * 精确判断数据类型
 * @param {*} value - 待判断的值
 * @returns {string} 类型字符串（小写）
 */
export function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export const isString = (val) => typeOf(val) === 'string'
export const isNumber = (val) => typeOf(val) === 'number'
export const isBoolean = (val) => typeOf(val) === 'boolean'
export const isArray = (val) => Array.isArray(val)
export const isObject = (val) => typeOf(val) === 'object'
export const isFunction = (val) => typeOf(val) === 'function'
export const isNull = (val) => val === null
export const isUndefined = (val) => val === undefined
export const isNullOrUndefined = (val) => isNull(val) || isUndefined(val)

/**
 * 判断值是否为空（null、undefined、空字符串、空数组、空对象）
 */
export function isEmpty(value) {
  if (isNullOrUndefined(value)) return true
  if (isString(value)) return value.trim() === ''
  if (isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

// ==================== 格式化方法 ====================

/**
 * 日期格式化
 * @param {string|number|Date} date - 日期
 * @param {string} format - 格式模板
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 相对时间（如：3分钟前）
 */
export function timeAgo(date) {
  if (!date) return ''
  const now = dayjs()
  const target = dayjs(date)
  const diffSeconds = now.diff(target, 'second')

  if (diffSeconds < 60) return '刚刚'
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}分钟前`
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}小时前`
  if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}天前`
  if (diffSeconds < 31536000) return `${Math.floor(diffSeconds / 2592000)}个月前`
  return `${Math.floor(diffSeconds / 31536000)}年前`
}

/**
 * 金额格式化
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数
 * @param {string} prefix - 前缀符号
 */
export function formatMoney(amount, decimals = 2, prefix = '¥') {
  if (isNullOrUndefined(amount) || isNaN(amount)) return `${prefix}0.00`
  const num = parseFloat(amount)
  return prefix + num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 手机号脱敏
 */
export function maskPhone(phone) {
  if (!phone) return ''
  const str = String(phone)
  return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 文件大小格式化
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, index)).toFixed(2) + ' ' + units[index]
}

/**
 * 数字格式化（超过万/亿简写）
 */
export function formatNumber(num) {
  if (isNullOrUndefined(num)) return '0'
  const n = Number(num)
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿'
  if (n >= 10000) return (n / 10000).toFixed(1) + '万'
  return String(n)
}

// ==================== 验证方法 ====================

/**
 * 手机号验证
 */
export function isPhone(value) {
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 邮箱验证
 */
export function isEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}

/**
 * 身份证号验证
 */
export function isIdCard(value) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

/**
 * URL 验证
 */
export function isUrl(value) {
  return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(value)
}

/**
 * 车牌号验证
 */
export function isCarNumber(value) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(value)
}

// ==================== 工具方法 ====================

/**
 * 防抖函数
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 */
export function throttle(fn, delay = 300) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  const clone = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key])
    }
  }
  return clone
}

/**
 * 深度合并对象
 */
export function deepMerge(target, source) {
  const result = deepClone(target)
  if (!isObject(source)) return result

  for (const key of Object.keys(source)) {
    if (isObject(source[key]) && isObject(result[key])) {
      result[key] = deepMerge(result[key], source[key])
    } else {
      result[key] = deepClone(source[key])
    }
  }
  return result
}

/**
 * 生成唯一 ID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 获取 URL 参数
 */
export function getUrlParams(url) {
  const params = {}
  const search = url.split('?')[1]
  if (!search) return params
  search.split('&').forEach(item => {
    const [key, value] = item.split('=')
    params[decodeURIComponent(key)] = decodeURIComponent(value || '')
  })
  return params
}

/**
 * 对象转 URL 查询字符串
 */
export function objectToQuery(obj) {
  if (!isObject(obj)) return ''
  return Object.entries(obj)
    .filter(([, value]) => !isNullOrUndefined(value) && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * 延迟执行
 */
export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 安全获取嵌套对象属性
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
  if (!obj || !path) return defaultValue
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    result = result?.[key]
    if (isNullOrUndefined(result)) return defaultValue
  }
  return result
}

// ==================== 平台相关 ====================

/**
 * 获取当前平台信息
 */
export function getPlatform() {
  let platform = 'unknown'
  // #ifdef H5
  platform = 'h5'
  // #endif
  // #ifdef MP-WEIXIN
  platform = 'mp-weixin'
  // #endif
  // #ifdef MP-ALIPAY
  platform = 'mp-alipay'
  // #endif
  // #ifdef APP-PLUS
  platform = 'app'
  // #endif
  return platform
}

/**
 * 获取系统信息（带缓存）
 */
let systemInfoCache = null
export function getSystemInfo() {
  if (systemInfoCache) return systemInfoCache
  try {
    systemInfoCache = uni.getSystemInfoSync()
  } catch (e) {
    systemInfoCache = {}
  }
  return systemInfoCache
}

/**
 * 获取状态栏高度
 */
export function getStatusBarHeight() {
  const systemInfo = getSystemInfo()
  return systemInfo.statusBarHeight || 0
}

/**
 * 获取导航栏高度
 */
export function getNavBarHeight() {
  const statusBarHeight = getStatusBarHeight()
  // #ifdef MP-WEIXIN
  const menuButton = uni.getMenuButtonBoundingClientRect()
  return statusBarHeight + (menuButton.top - statusBarHeight) * 2 + menuButton.height
  // #endif
  // #ifndef MP-WEIXIN
  return statusBarHeight + 44
  // #endif
}

/**
 * rpx 转 px
 */
export function rpxToPx(rpx) {
  const systemInfo = getSystemInfo()
  return (rpx / 750) * systemInfo.windowWidth
}

/**
 * px 转 rpx
 */
export function pxToRpx(px) {
  const systemInfo = getSystemInfo()
  return (px / systemInfo.windowWidth) * 750
}

export default {
  typeOf, isEmpty, isString, isNumber, isBoolean, isArray, isObject, isFunction,
  formatDate, timeAgo, formatMoney, maskPhone, formatFileSize, formatNumber,
  isPhone, isEmail, isIdCard, isUrl, isCarNumber,
  debounce, throttle, deepClone, deepMerge, generateUUID,
  getUrlParams, objectToQuery, sleep, getNestedValue,
  getPlatform, getSystemInfo, getStatusBarHeight, getNavBarHeight, rpxToPx, pxToRpx
}
