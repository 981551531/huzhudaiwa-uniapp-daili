/**
 * 支付工具
 * 支持微信支付、支付宝支付、余额支付等多种支付方式
 */

import { getToken } from './auth.js'
import http from './request.js'

/**
 * 支付类型枚举
 */
export const PAY_TYPE = {
  WECHAT: 'wechat',
  ALIPAY: 'alipay',
  BALANCE: 'balance',
  MP_WECHAT: 'mp_wechat'
}

/**
 * 微信小程序支付
 * @param {Object} payData 支付参数
 * @returns {Promise<Object>} 支付结果
 */
export function wechatMiniPay(payData) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.requestPayment({
      provider: 'wxpay',
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign,
      success: (res) => {
        resolve({ success: true, data: res })
      },
      fail: (err) => {
        reject({ success: false, message: err.errMsg || '支付失败' })
      }
    })
    // #endif
    // #ifndef MP-WEIXIN
    reject({ success: false, message: '请在微信小程序中使用' })
    // #endif
  })
}

/**
 * APP微信支付
 * @param {Object} payData 支付参数
 * @returns {Promise<Object>} 支付结果
 */
export function wechatAppPay(payData) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: payData.orderInfo || payData,
      success: (res) => {
        resolve({ success: true, data: res })
      },
      fail: (err) => {
        reject({ success: false, message: err.errMsg || '支付失败' })
      }
    })
    // #endif
    // #ifndef APP-PLUS
    reject({ success: false, message: '请在APP中使用' })
    // #endif
  })
}

/**
 * APP支付宝支付
 * @param {Object} payData 支付参数
 * @returns {Promise<Object>} 支付结果
 */
export function alipayAppPay(payData) {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    uni.requestPayment({
      provider: 'alipay',
      orderInfo: payData.orderInfo || payData,
      success: (res) => {
        resolve({ success: true, data: res })
      },
      fail: (err) => {
        reject({ success: false, message: err.errMsg || '支付失败' })
      }
    })
    // #endif
    // #ifndef APP-PLUS
    reject({ success: false, message: '请在APP中使用' })
    // #endif
  })
}

/**
 * H5微信公众号支付
 * @param {Object} payData 支付参数
 * @returns {Promise<Object>} 支付结果
 */
export function wechatH5Pay(payData) {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    if (typeof window === 'undefined' || !window.WeixinJSBridge) {
      reject({ success: false, message: '请在微信浏览器中使用' })
      return
    }

    const wxConfig = {
      appId: payData.appId,
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.paySign
    }

    window.WeixinJSBridge.invoke('getBrandWCPayRequest', wxConfig, (res) => {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        resolve({ success: true, data: res })
      } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        reject({ success: false, message: '用户取消支付' })
      } else {
        reject({ success: false, message: '支付失败' })
      }
    })
    // #endif
    // #ifndef H5
    reject({ success: false, message: '请在H5环境中使用' })
    // #endif
  })
}

/**
 * 判断是否在微信环境
 * @returns {boolean}
 */
export function isWechatEnv() {
  // #ifdef H5
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
  // #endif
  // #ifndef H5
  return false
  // #endif
}

/**
 * 统一支付方法
 * @param {Object} options 支付配置
 * @returns {Promise<Object>} 支付结果
 */
export async function pay(options = {}) {
  const {
    type = PAY_TYPE.WECHAT,
    orderId,
    amount,
    payData,
    onSuccess,
    onFail
  } = options

  try {
    let result

    switch (type) {
      case PAY_TYPE.MP_WECHAT:
        result = await wechatMiniPay(payData)
        break
      case PAY_TYPE.WECHAT:
        // #ifdef MP-WEIXIN
        result = await wechatMiniPay(payData)
        // #endif
        // #ifdef APP-PLUS
        result = await wechatAppPay(payData)
        // #endif
        // #ifdef H5
        if (isWechatEnv()) {
          result = await wechatH5Pay(payData)
        } else {
          throw new Error('请在微信环境中使用微信支付')
        }
        // #endif
        break
      case PAY_TYPE.ALIPAY:
        result = await alipayAppPay(payData)
        break
      case PAY_TYPE.BALANCE:
        result = await balancePay({ orderId, amount })
        break
      default:
        throw new Error('不支持的支付方式')
    }

    onSuccess && onSuccess(result)
    return result
  } catch (error) {
    onFail && onFail(error)
    throw error
  }
}

/**
 * 余额支付
 * @param {Object} options 支付配置
 * @returns {Promise<Object>} 支付结果
 */
export async function balancePay(options = {}) {
  const { orderId, amount, payPassword } = options

  try {
    const result = await http.post('/pay/balance', {
      orderId,
      amount,
      payPassword
    })
    return { success: true, data: result }
  } catch (error) {
    return { success: false, message: error.message || '余额支付失败' }
  }
}

/**
 * 查询支付状态
 * @param {string} orderId 订单ID
 * @returns {Promise<Object>} 支付状态
 */
export async function queryPayStatus(orderId) {
  try {
    const result = await http.get(`/pay/status/${orderId}`)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * 申请退款
 * @param {Object} options 退款配置
 * @returns {Promise<Object>} 退款结果
 */
export async function refund(options = {}) {
  const { orderId, reason, amount } = options

  try {
    const result = await http.post('/pay/refund', {
      orderId,
      reason,
      amount
    })
    return { success: true, data: result }
  } catch (error) {
    return { success: false, message: error.message || '退款申请失败' }
  }
}

/**
 * 获取支付方式列表
 * @returns {Array} 支付方式列表
 */
export function getPayMethods() {
  const methods = []

  // #ifdef MP-WEIXIN
  methods.push({
    type: PAY_TYPE.WECHAT,
    name: '微信支付',
    icon: 'weixin-fill',
    color: '#07c160'
  })
  // #endif

  // #ifdef APP-PLUS
  methods.push({
    type: PAY_TYPE.WECHAT,
    name: '微信支付',
    icon: 'weixin-fill',
    color: '#07c160'
  })
  methods.push({
    type: PAY_TYPE.ALIPAY,
    name: '支付宝支付',
    icon: 'zhifubao-fill',
    color: '#1677ff'
  })
  // #endif

  // #ifdef H5
  if (isWechatEnv()) {
    methods.push({
      type: PAY_TYPE.WECHAT,
      name: '微信支付',
      icon: 'weixin-fill',
      color: '#07c160'
    })
  }
  // #endif

  methods.push({
    type: PAY_TYPE.BALANCE,
    name: '余额支付',
    icon: 'wallet-fill',
    color: '#ff9500'
  })

  return methods
}

export default {
  PAY_TYPE,
  pay,
  wechatMiniPay,
  wechatAppPay,
  alipayAppPay,
  wechatH5Pay,
  balancePay,
  queryPayStatus,
  refund,
  getPayMethods,
  isWechatEnv
}
