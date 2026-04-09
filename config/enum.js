/**
 * 全局枚举定义
 * 用于定义业务相关的枚举值
 */

export const ORDER_STATUS = {
  CANCELLED: 0,
  UNPAID: 1,
  UNDELIVERED: 2,
  UNRECEIVED: 3,
  COMPLETED: 4,
  REFUNDING: 5,
  REFUNDED: 6
}

export const PAY_STATUS = {
  UNPAID: 0,
  PAYING: 1,
  SUCCESS: 2,
  FAILED: 3,
  REFUNDED: 4
}

export const PAY_TYPE = {
  WECHAT: 1,
  ALIPAY: 2,
  BALANCE: 3,
  BANK_CARD: 4
}

export const USER_STATUS = {
  DISABLED: 0,
  NORMAL: 1,
  PENDING: 2
}

export const AUDIT_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2
}

export const PRODUCT_STATUS = {
  OFF_SHELF: 0,
  ON_SHELF: 1,
  SOLD_OUT: 2
}

export const GENDER = {
  UNKNOWN: 0,
  MALE: 1,
  FEMALE: 2
}

export const COUPON_TYPE = {
  FULL_REDUCTION: 1,
  DISCOUNT: 2,
  VOUCHER: 3,
  EXCHANGE: 4
}

export const COUPON_STATUS = {
  UNUSED: 0,
  USED: 1,
  EXPIRED: 2
}

export const ADDRESS_TYPE = {
  HOME: 1,
  COMPANY: 2,
  SCHOOL: 3,
  OTHER: 4
}

export const FEEDBACK_TYPE = {
  SUGGESTION: 1,
  BUG_REPORT: 2,
  COMPLAINT: 3,
  OTHER: 4
}

export const PLATFORM = {
  H5: 'h5',
  MP_WEIXIN: 'mp-weixin',
  MP_ALIPAY: 'mp-alipay',
  APP_IOS: 'app-ios',
  APP_ANDROID: 'app-android'
}

export const STORAGE_KEY = {
  TOKEN: 'app_token',
  REFRESH_TOKEN: 'app_refresh_token',
  USER_INFO: 'app_user_info',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  SEARCH_HISTORY: 'app_search_history',
  CART: 'app_cart',
  LOCATION: 'app_location'
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

export const RESPONSE_CODE = {
  SUCCESS: 200,
  ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  PARAMS_ERROR: 400,
  TOKEN_EXPIRED: 10001,
  TOKEN_INVALID: 10002,
  ACCOUNT_DISABLED: 10003,
  ACCOUNT_NOT_EXIST: 10004,
  PASSWORD_ERROR: 10005,
  VERIFICATION_CODE_ERROR: 10006,
  VERIFICATION_CODE_EXPIRED: 10007,
  DATA_EXIST: 20001,
  DATA_NOT_EXIST: 20002,
  OPERATION_FAILED: 30001,
  PERMISSION_DENIED: 30002
}

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
}

export const FILE_SIZE = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
}

export const REGEX = {
  PHONE: /^1[3-9]\d{9}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  ID_CARD: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  URL: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
  CAR_NUMBER: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+~`|}{[\]:\\;"'<>,.?/]{6,20}$/,
  USERNAME: /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
  CHINESE: /^[\u4e00-\u9fa5]+$/,
  NUMBER: /^\d+$/,
  DECIMAL: /^\d+(\.\d+)?$/
}

export default {
  ORDER_STATUS,
  PAY_STATUS,
  PAY_TYPE,
  USER_STATUS,
  AUDIT_STATUS,
  PRODUCT_STATUS,
  GENDER,
  COUPON_TYPE,
  COUPON_STATUS,
  ADDRESS_TYPE,
  FEEDBACK_TYPE,
  PLATFORM,
  STORAGE_KEY,
  HTTP_STATUS,
  RESPONSE_CODE,
  TIME,
  FILE_SIZE,
  REGEX
}
