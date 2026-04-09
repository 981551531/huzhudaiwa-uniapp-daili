/**
 * 多环境配置
 * 优先级：
 * 1. 运行时调用 setEnv 手动切换
 * 2. 文件顶部 MANUAL_ENV 手动指定
 * 3. 根据当前运行环境自动判断
 */

const MANUAL_ENV = ''

export const ENV_TYPE = {
  DEV: 'development',
  TEST: 'test',
  UAT: 'uat',
  PROD: 'production'
}

const envConfig = {
  [ENV_TYPE.DEV]: {
    BASE_URL: 'https://bizapi.test.cltai.cn',
    UPLOAD_URL: 'https://dev-api.example.com/upload',
    SOCKET_URL: 'wss://dev-api.example.com/ws',
    CDN_URL: 'https://dev-cdn.example.com',
    APP_NAME: 'App(开发)',
    MAP_KEY: '',
    DEBUG: true
  },
  [ENV_TYPE.TEST]: {
    BASE_URL: 'https://test-api.example.com',
    UPLOAD_URL: 'https://test-api.example.com/upload',
    SOCKET_URL: 'wss://test-api.example.com/ws',
    CDN_URL: 'https://test-cdn.example.com',
    APP_NAME: 'App(测试)',
    MAP_KEY: '',
    DEBUG: true
  },
  [ENV_TYPE.UAT]: {
    BASE_URL: 'https://uat-api.example.com',
    UPLOAD_URL: 'https://uat-api.example.com/upload',
    SOCKET_URL: 'wss://uat-api.example.com/ws',
    CDN_URL: 'https://uat-cdn.example.com',
    APP_NAME: 'App(预发布)',
    MAP_KEY: '',
    DEBUG: false
  },
  [ENV_TYPE.PROD]: {
    BASE_URL: 'https://api.example.com',
    UPLOAD_URL: 'https://api.example.com/upload',
    SOCKET_URL: 'wss://api.example.com/ws',
    CDN_URL: 'https://cdn.example.com',
    APP_NAME: 'App',
    MAP_KEY: '',
    DEBUG: false
  }
}

function getCurrentEnv() {
  let env = ENV_TYPE.DEV

  // #ifdef H5
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname.includes('test')) {
      env = ENV_TYPE.TEST
    } else if (hostname.includes('uat')) {
      env = ENV_TYPE.UAT
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
      env = ENV_TYPE.DEV
    } else {
      env = ENV_TYPE.PROD
    }
  }
  // #endif

  // #ifdef MP-WEIXIN
  try {
    const accountInfo = uni.getAccountInfoSync()
    const envVersion = accountInfo.miniProgram.envVersion
    switch (envVersion) {
      case 'develop':
        env = ENV_TYPE.DEV
        break
      case 'trial':
        env = ENV_TYPE.UAT
        break
      case 'release':
        env = ENV_TYPE.PROD
        break
      default:
        env = ENV_TYPE.DEV
    }
  } catch (error) {
    env = ENV_TYPE.DEV
  }
  // #endif

  if (process.env.NODE_ENV === 'production' && env === ENV_TYPE.DEV) {
    env = ENV_TYPE.PROD
  }

  return env
}

let manualEnv = null

function resolveCurrentEnv() {
  if (manualEnv !== null) {
    return manualEnv
  }

  if (MANUAL_ENV && envConfig[MANUAL_ENV]) {
    return MANUAL_ENV
  }

  return getCurrentEnv()
}

export function setEnv(env) {
  if (envConfig[env]) {
    manualEnv = env
  } else {
    console.warn(`[ENV] 未知环境: ${env}`)
  }
}

export function getEnv() {
  return resolveCurrentEnv()
}

export function getEnvConfig() {
  return envConfig[resolveCurrentEnv()] || envConfig[ENV_TYPE.DEV]
}

export function getEnvConfigByEnv(env) {
  return envConfig[env] || envConfig[ENV_TYPE.DEV]
}

export default getEnvConfig
