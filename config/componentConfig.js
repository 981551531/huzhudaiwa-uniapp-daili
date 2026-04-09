import { http } from '@/uni_modules/uview-plus'
import { getEnvConfig } from '@/config/env.js'

const platform = uni.getSystemInfoSync().platform

export default {
  getServerNo(version, isPrompt = false, callback) {
    const httpData = {
      version: version.versionCode,
      versionName: version.versionName,
      setupPage: isPrompt,
      appType: 1,
      platformType: platform === 'android' ? 1101 : 1102
    }

    http.post(`${getEnvConfig().BASE_URL}/open/api/app/update/detail`, httpData, {
      isPrompt,
      custom: { toast: false }
    }).then((res) => {
      if (res && res.downloadUrl && res.versionCode !== version.versionCode) {
        if (!res.updateType) {
          res.updateType = res.forceUpdate ? 'forcibly' : 'solicit'
        }
        callback && callback(res)
        return
      }

      if (isPrompt) {
        uni.showToast({
          title: '暂无新版本',
          icon: 'none'
        })
      }
    }).catch((error) => {
      console.warn('检查更新失败', error)
    })
  },
  appUpdateColor: 'f00',
  appUpdateIcon: ''
}
