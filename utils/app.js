/**
 * App 相关工具方法
 * 包含版本更新、小程序更新、场景值解析、缓存处理等能力
 */

import { commonApi } from '@/api/index.js'

export function checkAppUpdate() {
  // #ifdef APP-PLUS
  getCurrentVersion().then((currentVersion) => {
    checkServerVersion(currentVersion)
  })
  // #endif
}

function getCurrentVersion() {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (info) => {
      resolve({
        versionCode: info.versionCode,
        versionName: info.version
      })
    })
    // #endif

    // #ifndef APP-PLUS
    resolve({ versionCode: '1.0.0', versionName: '1.0.0' })
    // #endif
  })
}

async function checkServerVersion(currentVersion) {
  // #ifdef APP-PLUS
  try {
    const serverVersion = await commonApi.getAppVersion()

    if (!serverVersion) {
      return
    }

    const versionName = serverVersion.versionName || serverVersion.version || ''
    if (!versionName || !compareVersion(currentVersion.versionName, versionName)) {
      return
    }

    showUpdatePopup({
      versionName,
      versionInfo: serverVersion.updateInfo || serverVersion.versionInfo || '发现新版本，建议立即更新',
      downloadUrl: serverVersion.downloadUrl,
      updateType: serverVersion.forceUpdate ? 'forcibly' : (serverVersion.updateType || 'solicit'),
      platform: plus.os.name.toLowerCase(),
      appleId: serverVersion.appleId
    })
  } catch (error) {
    console.warn('检查更新失败', error)
  }
  // #endif
}

function compareVersion(current, server) {
  const currentParts = String(current || '').split('.').map((item) => Number(item) || 0)
  const serverParts = String(server || '').split('.').map((item) => Number(item) || 0)
  const maxLength = Math.max(currentParts.length, serverParts.length)

  for (let index = 0; index < maxLength; index += 1) {
    const currentValue = currentParts[index] || 0
    const serverValue = serverParts[index] || 0

    if (serverValue > currentValue) {
      return true
    }

    if (serverValue < currentValue) {
      return false
    }
  }

  return false
}

function showUpdatePopup(data) {
  // #ifdef APP-PLUS
  uni.showModal({
    title: `发现新版本 ${data.versionName}`,
    content: data.versionInfo,
    showCancel: data.updateType !== 'forcibly',
    confirmText: '立即更新',
    cancelText: '暂不更新',
    success: (res) => {
      if (res.confirm) {
        startDownload(data)
      }
    }
  })
  // #endif
}

function startDownload(data) {
  // #ifdef APP-PLUS
  if (data.platform === 'ios') {
    if (data.appleId) {
      plus.runtime.openURL(`itms-apps://itunes.apple.com/cn/app/id${data.appleId}`)
    } else {
      uni.showToast({ title: '请前往 App Store 更新', icon: 'none' })
    }
    return
  }

  if (!data.downloadUrl) {
    uni.showToast({ title: '未获取到下载地址', icon: 'none' })
    return
  }

  if (data.downloadUrl.endsWith('.wgt')) {
    downloadWgt(data.downloadUrl)
    return
  }

  downloadApk(data.downloadUrl)
  // #endif
}

function downloadWgt(url) {
  // #ifdef APP-PLUS
  uni.showLoading({ title: '准备下载...', mask: true })

  const downloadTask = plus.downloader.createDownload(url, {
    filename: '_doc/update/'
  }, (download, status) => {
    if (status === 200) {
      uni.showLoading({ title: '正在安装...', mask: true })
      plus.runtime.install(download.filename, {}, () => {
        uni.showLoading({ title: '安装完成，正在重启...', mask: true })
        setTimeout(() => {
          plus.runtime.restart()
        }, 500)
      }, (error) => {
        uni.hideLoading()
        plus.nativeUI.alert(`安装失败：${error.message}`)
      })
      return
    }

    uni.hideLoading()
    plus.nativeUI.alert('下载失败')
  })

  downloadTask.start()

  downloadTask.addEventListener('statechanged', (task) => {
    if (task.state === 3 && task.totalSize > 0) {
      const progress = parseInt((task.downloadedSize / task.totalSize) * 100, 10)
      uni.showLoading({ title: `已下载 ${progress}%`, mask: true })
    }
  })
  // #endif
}

function downloadApk(url) {
  // #ifdef APP-PLUS
  uni.showLoading({ title: '准备下载...', mask: true })

  const downloadTask = plus.downloader.createDownload(url, {
    filename: '_doc/update/'
  }, (download, status) => {
    uni.hideLoading()

    if (status === 200) {
      plus.runtime.install(download.filename, {}, () => {
        // Android 安装器会自动拉起安装界面。
      }, (error) => {
        plus.nativeUI.alert(`安装失败：${error.message}`)
      })
      return
    }

    plus.nativeUI.alert('下载失败')
  })

  downloadTask.start()

  downloadTask.addEventListener('statechanged', (task) => {
    if (task.state === 3 && task.totalSize > 0) {
      const progress = parseInt((task.downloadedSize / task.totalSize) * 100, 10)
      uni.showLoading({ title: `已下载 ${progress}%`, mask: true })
    }
  })
  // #endif
}

export function mpUpdate(callback) {
  // #ifdef MP
  if (!uni.getUpdateManager) {
    const info = { type: 2 }
    callback && callback(info)
    return
  }

  const updateManager = uni.getUpdateManager()

  updateManager.onCheckForUpdate((res) => {
    callback && callback({ type: 1, data: res })
  })

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '检测到新版本，是否立即重启并应用更新？',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      }
    })
  })

  updateManager.onUpdateFailed(() => {
    uni.showModal({
      title: '更新失败',
      content: '新版本已经发布，请删除当前小程序后重新搜索打开。',
      showCancel: false
    })
  })
  // #endif
}

export function getSceneParams(options) {
  // #ifdef MP
  if (!options || !options.scene) {
    return null
  }

  const decodedScene = decodeURIComponent(options.scene)
  const params = {}

  decodedScene.split('&').forEach((pair) => {
    const [key, value] = pair.split('=')
    if (key && value !== undefined) {
      params[key] = value
    }
  })

  if (Object.keys(params).length > 0) {
    uni.setStorageSync('sceneParams', params)
  }

  return params
  // #endif

  // #ifndef MP
  return null
  // #endif
}

export function calculateCacheSize() {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    plus.cache.calculate((size) => {
      const sizeCache = parseInt(size, 10) || 0
      let fileSizeString = '0B'

      if (sizeCache < 1024) {
        fileSizeString = `${sizeCache}B`
      } else if (sizeCache < 1048576) {
        fileSizeString = `${(sizeCache / 1024).toFixed(2)}KB`
      } else if (sizeCache < 1073741824) {
        fileSizeString = `${(sizeCache / 1048576).toFixed(2)}MB`
      } else {
        fileSizeString = `${(sizeCache / 1073741824).toFixed(2)}GB`
      }

      resolve(fileSizeString)
    })
    // #endif

    // #ifndef APP-PLUS
    resolve('0B')
    // #endif
  })
}

export function clearCache() {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    plus.cache.clear(() => {
      uni.showToast({ title: '清理完成', icon: 'success' })
      resolve()
    }, (error) => {
      uni.showToast({ title: '清理失败', icon: 'none' })
      reject(error)
    })
    // #endif

    // #ifndef APP-PLUS
    const error = new Error('当前平台不支持清理缓存')
    uni.showToast({ title: error.message, icon: 'none' })
    reject(error)
    // #endif
  })
}

export function exitApp() {
  // #ifdef APP-PLUS
  plus.runtime.quit()
  // #endif

  // #ifndef APP-PLUS
  uni.showToast({ title: '当前平台不支持退出应用', icon: 'none' })
  // #endif
}

export function restartApp() {
  // #ifdef APP-PLUS
  plus.runtime.restart()
  // #endif

  // #ifndef APP-PLUS
  uni.showToast({ title: '当前平台不支持重启应用', icon: 'none' })
  // #endif
}

export default {
  checkAppUpdate,
  mpUpdate,
  getSceneParams,
  calculateCacheSize,
  clearCache,
  exitApp,
  restartApp
}
