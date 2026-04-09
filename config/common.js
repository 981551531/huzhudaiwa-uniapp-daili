import { mpUpdate, calculateCacheSize, clearCache as clearAppCache } from '@/utils/app.js'
import { getLocation, chooseLocation } from '@/utils/location.js'

function mpUpData(callback) {
  mpUpdate(callback)
}

function formatSize(callback) {
  calculateCacheSize().then((size) => {
    callback && callback(size)
  })
}

function clearCache(fileSizeString) {
  if (fileSizeString === '0B') {
    uni.showToast({
      title: '暂无缓存',
      duration: 2000,
      icon: 'none'
    })
    return Promise.resolve()
  }

  return clearAppCache()
}

function normalizeSceneOptions(options = {}, flag = false) {
  if (!options) {
    return {}
  }

  const normalized = { ...options }
  if (flag && options.result) {
    normalized.query = {
      ...(normalized.query || {}),
      q: options.result
    }
  }

  return normalized
}

function parseQueryString(queryString = '') {
  return queryString
    .split('&')
    .filter(Boolean)
    .reduce((result, item) => {
      const [key, value] = item.split('=')
      if (key && value !== undefined) {
        result[key] = value
      }
      return result
    }, {})
}

function scene(options, callback, flag = false) {
  const normalized = normalizeSceneOptions(options, flag)
  const query = normalized.query || {}

  let sceneInfo = {
    ...query,
    path: normalized.path || ''
  }

  if (query.q) {
    const decoded = decodeURIComponent(query.q)
    const queryString = decoded.includes('?') ? decoded.split('?')[1] : decoded
    sceneInfo = {
      ...sceneInfo,
      ...parseQueryString(queryString),
      scene: normalized.scene
    }
  } else if (query.qrCode) {
    const decoded = decodeURIComponent(query.qrCode)
    const queryString = decoded.includes('?') ? decoded.split('?')[1] : decoded
    sceneInfo = {
      ...sceneInfo,
      ...parseQueryString(queryString)
    }
  } else if (normalized.scene) {
    sceneInfo = {
      ...sceneInfo,
      ...parseQueryString(decodeURIComponent(normalized.scene))
    }
  }

  uni.setStorageSync('sceneParams', sceneInfo)
  callback && callback(sceneInfo)
  return sceneInfo
}

function loGetLocation(successCallback, errCallback, isOpenSetting = false) {
  getLocation({ openSetting: isOpenSetting })
    .then((location) => {
      uni.setStorageSync('locateInformation', location)
      successCallback && successCallback(location)
    })
    .catch((error) => {
      uni.removeStorageSync('locateInformation')
      errCallback && errCallback(error)
    })
}

function choiseRegion(callback) {
  return chooseLocation().then((result) => {
    callback && callback(result)
    return result
  })
}

export {
  mpUpData,
  formatSize,
  clearCache,
  scene,
  loGetLocation,
  choiseRegion
}
