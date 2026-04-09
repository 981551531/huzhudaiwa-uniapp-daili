/**
 * API 接口定义
 * 统一管理所有接口地址
 */

import http from '@/utils/request.js'

const API_PREFIX = {
  AUTH: '/auth',
  USER: '/user',
  ORDER: '/order',
  PRODUCT: '/product',
  CART: '/cart',
  ADDRESS: '/address',
  UPLOAD: '/upload',
  PAY: '/pay',
  COMMON: '/common'
}

export const authApi = {
  login: (data) => http.post('/auth/login', data, { noAuth: true }),
  logout: () => http.post('/auth/logout'),
  loginByCode: (data) => http.post('/auth/loginByCode', data, { noAuth: true }),
  loginByPassword: (data) => http.post('/auth/loginByPassword', data, { noAuth: true }),
  register: (data) => http.post('/auth/register', data, { noAuth: true }),
  sendSmsCode: (data) => http.post('/auth/sendSmsCode', data, { noAuth: true, noRepeat: true }),
  refreshToken: (data) => http.post('/auth/refreshToken', data, { noAuth: true }),
  resetPassword: (data) => http.post('/auth/resetPassword', data, { noAuth: true }),
  wechatLogin: (data) => http.post('/auth/wechatLogin', data, { noAuth: true }),
  bindWechatMobile: (data) => http.post('/auth/bindWechatMobile', data, { noAuth: true })
}

export const userApi = {
  getUserInfo: () => http.get('/user/info'),
  updateUserInfo: (data) => http.post('/user/update', data),
  updateAvatar: (data) => http.post('/user/avatar', data),
  updatePassword: (data) => http.post('/user/password', data),
  updatePayPassword: (data) => http.post('/user/payPassword', data),
  realNameAuth: (data) => http.post('/user/realNameAuth', data),
  getWalletInfo: () => http.get('/user/wallet'),
  getWalletLog: (params) => http.get('/user/wallet/log', params),
  getPointsLog: (params) => http.get('/user/points/log', params),
  getFansList: (params) => http.get('/user/fans', params),
  getFollowList: (params) => http.get('/user/follow', params)
}

export const orderApi = {
  getList: (params) => http.get('/order/list', params),
  getDetail: (id) => http.get(`/order/detail/${id}`),
  create: (data) => http.post('/order/create', data),
  cancel: (id) => http.post(`/order/cancel/${id}`),
  confirm: (id) => http.post(`/order/confirm/${id}`),
  delete: (id) => http.post(`/order/delete/${id}`),
  getLogistics: (id) => http.get(`/order/logistics/${id}`),
  applyRefund: (data) => http.post('/order/refund', data),
  getRefundDetail: (id) => http.get(`/order/refund/${id}`)
}

export const productApi = {
  getList: (params) => http.get('/product/list', params),
  getDetail: (id) => http.get(`/product/detail/${id}`),
  getCategory: () => http.get('/product/category'),
  search: (params) => http.get('/product/search', params),
  getRecommend: (params) => http.get('/product/recommend', params),
  getHot: (params) => http.get('/product/hot', params),
  getNew: (params) => http.get('/product/new', params)
}

export const cartApi = {
  getList: () => http.get('/cart/list'),
  add: (data) => http.post('/cart/add', data),
  update: (data) => http.post('/cart/update', data),
  delete: (ids) => http.post('/cart/delete', { ids }),
  clear: () => http.post('/cart/clear'),
  checkAll: (checked) => http.post('/cart/checkAll', { checked }),
  getCheckedList: () => http.get('/cart/checked')
}

export const addressApi = {
  getList: () => http.get('/address/list'),
  getDetail: (id) => http.get(`/address/detail/${id}`),
  add: (data) => http.post('/address/add', data),
  update: (data) => http.post('/address/update', data),
  delete: (id) => http.post(`/address/delete/${id}`),
  setDefault: (id) => http.post(`/address/default/${id}`),
  getDefault: () => http.get('/address/default')
}

export const uploadApi = {
  image: (filePath, onProgress) => http.upload({
    url: '/upload/image',
    filePath,
    onProgress
  }),
  video: (filePath, onProgress) => http.upload({
    url: '/upload/video',
    filePath,
    onProgress
  }),
  file: (filePath, onProgress) => http.upload({
    url: '/upload/file',
    filePath,
    onProgress
  })
}

export const payApi = {
  createOrder: (data) => http.post('/pay/create', data),
  wechatPay: (data) => http.post('/pay/wechat', data),
  alipay: (data) => http.post('/pay/alipay', data),
  balancePay: (data) => http.post('/pay/balance', data),
  queryStatus: (orderId) => http.get(`/pay/status/${orderId}`),
  refund: (data) => http.post('/pay/refund', data)
}

export const commonApi = {
  getBanner: (params) => http.get('/common/banner', params),
  getNotice: (params) => http.get('/common/notice', params),
  getArticle: (params) => http.get('/common/article', params),
  getArticleDetail: (id) => http.get(`/common/article/${id}`),
  getAgreement: (type) => http.get(`/common/agreement/${type}`),
  getAreaTree: (params) => http.get('/common/area/tree', params),
  getCityList: (params) => http.get('/common/city', params),
  getDict: (type) => http.get(`/common/dict/${type}`),
  uploadFeedback: (data) => http.post('/common/feedback', data),
  getAppVersion: () => http.get('/common/version')
}

export const couponApi = {
  getList: (params) => http.get('/coupon/list', params),
  getMyList: (params) => http.get('/coupon/my', params),
  receive: (id) => http.post(`/coupon/receive/${id}`),
  use: (data) => http.post('/coupon/use', data),
  getAvailable: (params) => http.get('/coupon/available', params)
}

export const storeApi = {
  getList: (params) => http.get('/store/list', params),
  getDetail: (id) => http.get(`/store/detail/${id}`),
  getNearby: (params) => http.get('/store/nearby', params)
}

export const activityApi = {
  getList: (params) => http.get('/activity/list', params),
  getDetail: (id) => http.get(`/activity/detail/${id}`),
  enroll: (data) => http.post('/activity/enroll', data),
  getMyList: (params) => http.get('/activity/my', params)
}

export default {
  authApi,
  userApi,
  orderApi,
  productApi,
  cartApi,
  addressApi,
  uploadApi,
  payApi,
  commonApi,
  couponApi,
  storeApi,
  activityApi
}

