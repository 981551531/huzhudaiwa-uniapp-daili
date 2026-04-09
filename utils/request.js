import { getEnvConfig } from '@/config/env.js'
import { STORAGE_KEYS, REQUEST, RESPONSE_CODE, PAGES } from '@/config/constants.js'
import { removeToken, removeUserInfo } from '@/utils/auth.js'

const pendingRequests = new Map()
let isRefreshing = false
let refreshSubscribers = []
let isRedirectingToLogin = false

function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback.resolve(newToken))
  refreshSubscribers = []
}

function onTokenRefreshFailed(error) {
  refreshSubscribers.forEach((callback) => callback.reject(error))
  refreshSubscribers = []
}

function addRefreshSubscriber(resolve, reject) {
  refreshSubscribers.push({ resolve, reject })
}

function generateRequestKey(config) {
  return `${config.method || 'GET'}_${config.url}_${JSON.stringify(config.data || {})}`
}

function requestInterceptor(config) {
  const envConfig = getEnvConfig()
  const nextConfig = {
    method: 'GET',
    header: {},
    retryCount: 0,
    timeout: REQUEST.TIMEOUT,
    ...config
  }

  if (nextConfig.url && !nextConfig.url.startsWith('http')) {
    nextConfig.url = `${envConfig.BASE_URL}${nextConfig.url}`
  }

  nextConfig.header = {
    'Content-Type': REQUEST.CONTENT_TYPE,
    ...nextConfig.header
  }

  const token = uni.getStorageSync(STORAGE_KEYS.TOKEN)
  if (token && !nextConfig.noAuth) {
    nextConfig.header.Authorization = `Bearer ${token}`
  }

  return nextConfig
}

function normalizeResponseData(data, statusCode) {
  const code = data?.code ?? data?.status ?? statusCode
  return {
    code,
    message: data?.message || data?.msg || '',
    payload: data?.data !== undefined ? data.data : data,
    raw: data
  }
}

async function responseInterceptor(response, config) {
  const { statusCode, data } = response

  if (statusCode !== 200) {
    throw handleHttpError(statusCode, config)
  }

  const normalized = normalizeResponseData(data, statusCode)

  if (normalized.code === RESPONSE_CODE.SUCCESS) {
    return normalized.payload
  }

  if (
    normalized.code === RESPONSE_CODE.TOKEN_EXPIRED ||
    normalized.code === RESPONSE_CODE.UNAUTHORIZED
  ) {
    return handleTokenExpired(config)
  }

  const message = normalized.message || '请求失败'
  if (!config.silent) {
    uni.showToast({ title: message, icon: 'none', duration: 2000 })
  }

  throw {
    code: normalized.code,
    message,
    data: normalized.raw
  }
}

async function handleTokenExpired(config) {
  if (config._retryAfterRefresh) {
    goToLogin()
    throw { code: RESPONSE_CODE.UNAUTHORIZED, message: '登录已过期' }
  }

  const refreshToken = uni.getStorageSync(STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) {
    goToLogin()
    throw { code: RESPONSE_CODE.UNAUTHORIZED, message: '请先登录' }
  }

  if (!isRefreshing) {
    isRefreshing = true

    try {
      const newToken = await refreshTokenRequest(refreshToken)
      uni.setStorageSync(STORAGE_KEYS.TOKEN, newToken)
      onTokenRefreshed(newToken)
      return request({ ...config, _retryAfterRefresh: true })
    } catch (error) {
      onTokenRefreshFailed(error)
      goToLogin()
      throw { code: RESPONSE_CODE.UNAUTHORIZED, message: '登录已过期' }
    } finally {
      isRefreshing = false
    }
  }

  return new Promise((resolve, reject) => {
    addRefreshSubscriber(
      () => resolve(request({ ...config, _retryAfterRefresh: true })),
      (error) => reject(error)
    )
  })
}

function refreshTokenRequest(refreshToken) {
  const envConfig = getEnvConfig()

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${envConfig.BASE_URL}/auth/refreshToken`,
      method: 'POST',
      data: { refreshToken },
      success: (res) => {
        const normalized = normalizeResponseData(res.data, res.statusCode)
        if (res.statusCode === 200 && normalized.code === RESPONSE_CODE.SUCCESS && normalized.payload?.token) {
          resolve(normalized.payload.token)
          return
        }

        reject({ code: normalized.code, message: normalized.message || '刷新 token 失败' })
      },
      fail: (error) => reject({ code: -1, message: error.errMsg || '网络异常' })
    })
  })
}

function handleHttpError(statusCode, config) {
  const errorMessages = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求地址不存在',
    408: '请求超时',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  }

  const message = errorMessages[statusCode] || `请求失败(${statusCode})`

  if (!config.silent) {
    uni.showToast({ title: message, icon: 'none', duration: 2000 })
  }

  if (statusCode === 401) {
    goToLogin()
  }

  return { code: statusCode, message }
}

function goToLogin() {
  removeToken()
  removeUserInfo()

  if (isRedirectingToLogin) {
    return
  }

  isRedirectingToLogin = true
  setTimeout(() => {
    uni.reLaunch({ url: PAGES.LOGIN })
    isRedirectingToLogin = false
  }, 300)
}

function createUniRequest(config) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.url,
      method: config.method,
      data: config.data,
      header: config.header,
      timeout: config.timeout,
      success: resolve,
      fail: reject
    })
  })
}

async function request(options = {}) {
  const config = requestInterceptor({ ...options })
  const requestKey = config.noRepeat ? generateRequestKey(config) : ''

  if (requestKey) {
    if (pendingRequests.has(requestKey)) {
      throw { code: -1, message: '请勿重复请求' }
    }
    pendingRequests.set(requestKey, true)
  }

  if (config.loading) {
    uni.showLoading({ title: config.loadingText || '加载中...', mask: true })
  }

  try {
    const response = await createUniRequest(config)
    return await responseInterceptor(response, config)
  } catch (error) {
    if (error?.statusCode) {
      throw error
    }

    const retryCount = Number.isInteger(config.retryCount) ? config.retryCount : 0
    if (retryCount > 0) {
      await new Promise((resolve) => setTimeout(resolve, REQUEST.RETRY_DELAY))
      return request({ ...config, retryCount: retryCount - 1 })
    }

    if (error?.code !== undefined && error?.message) {
      throw error
    }

    if (!config.silent) {
      uni.showToast({ title: '网络异常，请检查网络连接', icon: 'none' })
    }

    throw {
      code: -1,
      message: error?.errMsg || '网络异常'
    }
  } finally {
    if (config.loading) {
      uni.hideLoading()
    }

    if (requestKey) {
      pendingRequests.delete(requestKey)
    }
  }
}

function upload(options = {}) {
  const envConfig = getEnvConfig()
  const token = uni.getStorageSync(STORAGE_KEYS.TOKEN)

  let url = options.url || '/upload'
  if (!url.startsWith('http')) {
    url = envConfig.UPLOAD_URL || `${envConfig.BASE_URL}${url}`
  }

  if (options.loading) {
    uni.showLoading({ title: options.loadingText || '上传中...', mask: true })
  }

  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url,
      filePath: options.filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        Authorization: token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        let data = res.data
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (error) {
            reject({ code: -1, message: '上传响应解析失败' })
            return
          }
        }

        const normalized = normalizeResponseData(data, res.statusCode)
        if (res.statusCode === 200 && normalized.code === RESPONSE_CODE.SUCCESS) {
          resolve(normalized.payload)
          return
        }

        reject({ code: normalized.code, message: normalized.message || '上传失败' })
      },
      fail: (error) => reject({ code: -1, message: error.errMsg || '上传失败' }),
      complete: () => {
        if (options.loading) {
          uni.hideLoading()
        }
      }
    })

    if (options.onProgress) {
      uploadTask.onProgressUpdate(options.onProgress)
    }
  })
}

const http = {
  get: (url, data, options = {}) => request({ url, method: 'GET', data, ...options }),
  post: (url, data, options = {}) => request({ url, method: 'POST', data, ...options }),
  put: (url, data, options = {}) => request({ url, method: 'PUT', data, ...options }),
  delete: (url, data, options = {}) => request({ url, method: 'DELETE', data, ...options }),
  upload,
  request
}

export default http
export { request, upload }
