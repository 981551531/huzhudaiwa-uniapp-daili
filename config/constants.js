/**
 * 全局常量配置
 */

export const STORAGE_KEYS = {
  TOKEN: 'app_token',
  REFRESH_TOKEN: 'app_refresh_token',
  USER_INFO: 'app_user_info',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  FIRST_LAUNCH: 'app_first_launch',
  SEARCH_HISTORY: 'app_search_history'
}

export const REQUEST = {
  TIMEOUT: 30000,
  RETRY_COUNT: 2,
  RETRY_DELAY: 1000,
  CONTENT_TYPE: 'application/json'
}

export const RESPONSE_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  TOKEN_EXPIRED: 10001,
  TOKEN_INVALID: 10002,
  PARAMS_ERROR: 10003
}

export const PAGES = {
  HOME: '/pages/index/index',
  LOGIN: '/pages/login/login',
  REQUEST_DEMO: '/pages/demo/request-demo/request-demo',
  STORE_DEMO: '/pages/demo/store-demo/store-demo',
  FRAMEWORK_DEMO: '/pages/demo/framework-demo/framework-demo',
  CRUD_DEMO: '/pages/demo/crud-demo/crud-demo',
  COMPONENT_DEMO: '/pages/demo/component-demo/component-demo',
  UTILS_DEMO: '/pages/demo/utils-demo/utils-demo'
}

export const UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024,
  IMAGE_MAX_SIZE: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  MAX_COUNT: 9
}

export const PAGINATION = {
  PAGE_SIZE: 20,
  PAGE_NUM: 1
}
