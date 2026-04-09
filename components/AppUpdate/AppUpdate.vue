<template>
  <view></view>
</template>

<script>
/**
 * APP更新组件
 * 支持 iOS 和 Android 平台的热更新和应用商店更新
 */
import { ref, onMounted } from 'vue'
import { getEnvConfig } from '@/config/env.js'
import { commonApi } from '@/api/index.js'

export default {
  name: 'AppUpdate',
  setup() {
    const updateData = ref(null)
    const downloadTask = ref(null)
    const popupInstance = ref(null)

    const getMainColor = () => {
      return '#1890ff'
    }

    const getCurrentVersion = () => {
      return new Promise((resolve) => {
        // #ifdef APP-PLUS
        plus.runtime.getProperty(plus.runtime.appid, (inf) => {
          resolve({
            versionCode: inf.versionCode,
            versionName: inf.version
          })
        })
        // #endif
        // #ifndef APP-PLUS
        resolve({ versionCode: '1.0.0', versionName: '1.0.0' })
        // #endif
      })
    }

    const checkUpdate = async (showToast = false) => {
      // #ifndef APP-PLUS
      if (showToast) {
        uni.showToast({ title: '请在APP中使用', icon: 'none' })
      }
      return
      // #endif

      // #ifdef APP-PLUS
      try {
        const currentVersion = await getCurrentVersion()
        const result = await commonApi.getAppVersion()

        if (!result || !result.data) {
          if (showToast) {
            uni.showToast({ title: '当前已是最新版本', icon: 'success' })
          }
          return
        }

        const serverVersion = result.data
        const needUpdate = compareVersion(currentVersion.versionName, serverVersion.versionName)

        if (!needUpdate) {
          if (showToast) {
            uni.showToast({ title: '当前已是最新版本', icon: 'success' })
          }
          return
        }

        updateData.value = {
          versionName: serverVersion.versionName,
          versionInfo: serverVersion.updateInfo || '发现新版本，建议更新',
          downloadUrl: serverVersion.downloadUrl,
          updateType: serverVersion.forceUpdate ? 'forcibly' : 'solicit',
          platform: plus.os.name.toLowerCase()
        }

        showUpdatePopup()
      } catch (error) {
        console.error('检查更新失败:', error)
        if (showToast) {
          uni.showToast({ title: '检查更新失败', icon: 'none' })
        }
      }
      // #endif
    }

    const compareVersion = (current, server) => {
      const currentArr = current.split('.').map(Number)
      const serverArr = server.split('.').map(Number)
      const len = Math.max(currentArr.length, serverArr.length)

      for (let i = 0; i < len; i++) {
        const currentNum = currentArr[i] || 0
        const serverNum = serverArr[i] || 0
        if (serverNum > currentNum) return true
        if (serverNum < currentNum) return false
      }
      return false
    }

    const showUpdatePopup = () => {
      if (!updateData.value) return

      const data = updateData.value

      uni.showModal({
        title: `发现新版本 ${data.versionName}`,
        content: data.versionInfo,
        showCancel: data.updateType !== 'forcibly',
        confirmText: '立即更新',
        cancelText: '暂不更新',
        success: (res) => {
          if (res.confirm) {
            startDownload()
          }
        }
      })
    }

    const startDownload = () => {
      if (!updateData.value) return

      const data = updateData.value

      // iOS跳转App Store
      if (data.platform === 'ios') {
        const appleId = data.appleId || ''
        if (appleId) {
          plus.runtime.openURL(`itms-apps://itunes.apple.com/cn/app/id${appleId}`)
        } else {
          uni.showToast({ title: '请前往App Store更新', icon: 'none' })
        }
        return
      }

      // Android下载更新
      if (data.downloadUrl.endsWith('.wgt')) {
        downloadWgt(data.downloadUrl)
      } else {
        downloadApk(data.downloadUrl)
      }
    }

    const downloadWgt = (url) => {
      const popupData = {
        progress: true,
        buttonNum: updateData.value.updateType === 'forcibly' ? 0 : 2
      }

      showDownloadPopup(popupData)

      downloadTask.value = plus.downloader.createDownload(url, {
        filename: '_doc/update/'
      }, (download, status) => {
        if (status === 200) {
          updateDownloadPopup({ progressValue: 100, progressTip: '正在安装...' })
          plus.runtime.install(download.filename, {}, () => {
            updateDownloadPopup({ contentText: '安装完成，正在重启...' })
            setTimeout(() => {
              plus.runtime.restart()
            }, 500)
          }, (e) => {
            hideDownloadPopup()
            plus.nativeUI.alert(`安装失败: ${e.message}`)
          })
        } else {
          hideDownloadPopup()
          plus.nativeUI.alert('下载失败')
        }
      })

      downloadTask.value.start()

      downloadTask.value.addEventListener('statechanged', (task) => {
        if (task.state === 3) {
          const progress = parseInt((task.downloadedSize / task.totalSize) * 100)
          updateDownloadPopup({
            progressValue: progress,
            progressTip: `已下载 ${progress}%`
          })
        }
      })
    }

    const downloadApk = (url) => {
      const popupData = {
        progress: true,
        buttonNum: updateData.value.updateType === 'forcibly' ? 0 : 2
      }

      showDownloadPopup(popupData)

      downloadTask.value = plus.downloader.createDownload(url, {
        filename: '_doc/update/'
      }, (download, status) => {
        if (status === 200) {
          hideDownloadPopup()
          plus.runtime.install(download.filename, {}, () => {
            // APK安装后会自动打开安装界面
          }, (e) => {
            plus.nativeUI.alert(`安装失败: ${e.message}`)
          })
        } else {
          hideDownloadPopup()
          plus.nativeUI.alert('下载失败')
        }
      })

      downloadTask.value.start()

      downloadTask.value.addEventListener('statechanged', (task) => {
        if (task.state === 3) {
          const progress = parseInt((task.downloadedSize / task.totalSize) * 100)
          updateDownloadPopup({
            progressValue: progress,
            progressTip: `已下载 ${progress}%`
          })
        }
      })
    }

    const showDownloadPopup = (data) => {
      uni.showLoading({
        title: data.progressTip || '准备下载...',
        mask: true
      })
    }

    const updateDownloadPopup = (data) => {
      uni.showLoading({
        title: data.progressTip || '下载中...',
        mask: true
      })
    }

    const hideDownloadPopup = () => {
      uni.hideLoading()
    }

    const cancelDownload = () => {
      if (downloadTask.value) {
        downloadTask.value.abort()
        downloadTask.value = null
      }
      hideDownloadPopup()
    }

    onMounted(() => {
      // APP启动时自动检查更新
      // #ifdef APP-PLUS
      setTimeout(() => {
        checkUpdate(false)
      }, 2000)
      // #endif
    })

    return {
      checkUpdate,
      cancelDownload
    }
  }
}
</script>
