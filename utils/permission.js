/**
 * APP权限管理工具
 * 支持 iOS 和 Android 平台的权限判断和请求
 */

let isIos = false
// #ifdef APP-PLUS
isIos = plus.os.name === 'iOS'
// #endif

/**
 * iOS权限判断
 */
const iosPermission = {
  push() {
    let result = 0
    const UIApplication = plus.ios.import('UIApplication')
    const app = UIApplication.sharedApplication()
    if (app.currentUserNotificationSettings) {
      const settings = app.currentUserNotificationSettings()
      const enabledTypes = settings.plusGetAttribute('types')
      result = enabledTypes === 0 ? 0 : 1
      plus.ios.deleteObject(settings)
    } else {
      const enabledTypes = app.enabledRemoteNotificationTypes()
      result = enabledTypes === 0 ? 0 : 1
    }
    plus.ios.deleteObject(app)
    plus.ios.deleteObject(UIApplication)
    return { result, permissionName: '推送' }
  },

  location() {
    const cllocationManger = plus.ios.import('CLLocationManager')
    const status = cllocationManger.authorizationStatus()
    const result = status !== 2 ? 1 : 0
    plus.ios.deleteObject(cllocationManger)
    return { result, permissionName: '定位' }
  },

  record() {
    const avaudiosession = plus.ios.import('AVAudioSession')
    const avaudio = avaudiosession.sharedInstance()
    const permissionStatus = avaudio.recordPermission()
    const result = (permissionStatus === 1684369017 || permissionStatus === 1970168948) ? 0 : 1
    plus.ios.deleteObject(avaudiosession)
    return { result, permissionName: '麦克风' }
  },

  camera() {
    const AVCaptureDevice = plus.ios.import('AVCaptureDevice')
    const authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide')
    const result = authStatus === 3 ? 1 : 0
    plus.ios.deleteObject(AVCaptureDevice)
    return { result, permissionName: '相机' }
  },

  photoLibrary() {
    const PHPhotoLibrary = plus.ios.import('PHPhotoLibrary')
    const authStatus = PHPhotoLibrary.authorizationStatus()
    const result = authStatus === 3 ? 1 : 0
    plus.ios.deleteObject(PHPhotoLibrary)
    return { result, permissionName: '相册' }
  },

  contact() {
    const CNContactStore = plus.ios.import('CNContactStore')
    const cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0)
    const result = cnAuthStatus === 3 ? 1 : 0
    plus.ios.deleteObject(CNContactStore)
    return { result, permissionName: '通讯录' }
  },

  calendar() {
    const EKEventStore = plus.ios.import('EKEventStore')
    const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0)
    const result = ekAuthStatus === 3 ? 1 : 0
    plus.ios.deleteObject(EKEventStore)
    return { result, permissionName: '日历' }
  },

  memo() {
    const EKEventStore = plus.ios.import('EKEventStore')
    const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1)
    const result = ekAuthStatus === 3 ? 1 : 0
    plus.ios.deleteObject(EKEventStore)
    return { result, permissionName: '备忘录' }
  }
}

/**
 * Android权限请求
 * @param {string} permissionID 权限ID
 * @param {string} permissionName 权限名称
 * @returns {Promise<Object>} 权限状态
 */
function requestAndroidPermission(permissionID, permissionName) {
  return new Promise((resolve) => {
    // #ifdef APP-PLUS
    plus.android.requestPermissions(
      [permissionID],
      (resultObj) => {
        let result = 0
        if (resultObj.granted.length > 0) {
          result = 1
        } else if (resultObj.deniedPresent.length > 0) {
          result = 0
        } else if (resultObj.deniedAlways.length > 0) {
          result = -1
        }
        resolve({ result, permissionName })
      },
      (error) => {
        resolve({ result: 0, permissionName, error })
      }
    )
    // #endif
    // #ifndef APP-PLUS
    resolve({ result: 1, permissionName })
    // #endif
  })
}

/**
 * 权限ID映射
 */
const permissionMap = {
  location: {
    ios: 'location',
    android: 'android.permission.ACCESS_FINE_LOCATION',
    name: '定位'
  },
  camera: {
    ios: 'camera',
    android: 'android.permission.CAMERA',
    name: '相机'
  },
  photoLibrary: {
    ios: 'photoLibrary',
    android: 'android.permission.READ_EXTERNAL_STORAGE',
    name: '相册'
  },
  record: {
    ios: 'record',
    android: 'android.permission.RECORD_AUDIO',
    name: '麦克风'
  },
  contact: {
    ios: 'contact',
    android: 'android.permission.READ_CONTACTS',
    name: '通讯录'
  },
  calendar: {
    ios: 'calendar',
    android: 'android.permission.READ_CALENDAR',
    name: '日历'
  },
  push: {
    ios: 'push',
    android: null,
    name: '推送'
  },
  memo: {
    ios: 'memo',
    android: null,
    name: '备忘录'
  },
  callPhone: {
    ios: null,
    android: 'android.permission.CALL_PHONE',
    name: '拨打电话'
  }
}

/**
 * 判断权限
 * @param {string} permissionKey 权限key
 * @param {Function} callback 回调函数
 */
export function judgePermission(permissionKey, callback) {
  const permission = permissionMap[permissionKey]
  if (!permission) {
    console.warn(`未知权限: ${permissionKey}`)
    callback && callback(0)
    return
  }

  const handleResult = (res) => {
    if (res.result === -1) {
      uni.showModal({
        title: '提示',
        content: `您还未开通${res.permissionName}权限，是否去应用设置里开通？`,
        confirmText: '去开通',
        cancelText: '取消',
        success: (data) => {
          if (data.confirm) {
            gotoAppPermissionSetting()
          }
        }
      })
    }
    callback && callback(res.result)
  }

  // #ifdef APP-PLUS
  if (isIos) {
    if (permission.ios && iosPermission[permission.ios]) {
      handleResult(iosPermission[permission.ios]())
    } else {
      callback && callback(1)
    }
  } else {
    if (permission.android) {
      requestAndroidPermission(permission.android, permission.name).then(handleResult)
    } else {
      callback && callback(1)
    }
  }
  // #endif

  // #ifndef APP-PLUS
  callback && callback(1)
  // #endif
}

/**
 * 异步判断权限
 * @param {string} permissionKey 权限key
 * @returns {Promise<number>} 权限状态 1:已授权 0:未授权 -1:永久拒绝
 */
export function checkPermission(permissionKey) {
  return new Promise((resolve) => {
    judgePermission(permissionKey, resolve)
  })
}

/**
 * 跳转到应用权限设置页面
 */
export function gotoAppPermissionSetting() {
  // #ifdef APP-PLUS
  if (isIos) {
    const UIApplication = plus.ios.import('UIApplication')
    const application = UIApplication.sharedApplication()
    const NSURL = plus.ios.import('NSURL')
    const setting = NSURL.URLWithString('app-settings:')
    application.openURL(setting)
    plus.ios.deleteObject(setting)
    plus.ios.deleteObject(NSURL)
    plus.ios.deleteObject(application)
  } else {
    const Intent = plus.android.importClass('android.content.Intent')
    const Settings = plus.android.importClass('android.provider.Settings')
    const Uri = plus.android.importClass('android.net.Uri')
    const mainActivity = plus.android.runtimeMainActivity()
    const intent = new Intent()
    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
    const uri = Uri.fromParts('package', mainActivity.getPackageName(), null)
    intent.setData(uri)
    mainActivity.startActivity(intent)
  }
  // #endif
}

/**
 * 检查系统定位服务是否开启
 * @returns {boolean} 是否开启
 */
export function checkSystemEnableLocation() {
  // #ifdef APP-PLUS
  if (isIos) {
    const cllocationManger = plus.ios.import('CLLocationManager')
    const result = cllocationManger.locationServicesEnabled()
    plus.ios.deleteObject(cllocationManger)
    return result
  } else {
    const context = plus.android.importClass('android.content.Context')
    const locationManager = plus.android.importClass('android.location.LocationManager')
    const main = plus.android.runtimeMainActivity()
    const mainSvr = main.getSystemService(context.LOCATION_SERVICE)
    return mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)
  }
  // #endif
  // #ifndef APP-PLUS
  return true
  // #endif
}

/**
 * 请求定位权限并获取位置
 * @param {Function} successCallback 成功回调
 * @param {Function} errorCallback 失败回调
 */
export function requestLocationPermission(successCallback, errorCallback) {
  judgePermission('location', (result) => {
    if (result === 1) {
      // #ifdef APP-PLUS
      if (!checkSystemEnableLocation()) {
        uni.showModal({
          title: '提示',
          content: '请开启系统定位服务',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              gotoAppPermissionSetting()
            }
          }
        })
        errorCallback && errorCallback('系统定位服务未开启')
        return
      }
      // #endif
      successCallback && successCallback()
    } else {
      errorCallback && errorCallback('定位权限未授权')
    }
  })
}

/**
 * 请求相机权限
 * @param {Function} successCallback 成功回调
 * @param {Function} errorCallback 失败回调
 */
export function requestCameraPermission(successCallback, errorCallback) {
  judgePermission('camera', (result) => {
    if (result === 1) {
      successCallback && successCallback()
    } else {
      errorCallback && errorCallback('相机权限未授权')
    }
  })
}

/**
 * 请求相册权限
 * @param {Function} successCallback 成功回调
 * @param {Function} errorCallback 失败回调
 */
export function requestPhotoLibraryPermission(successCallback, errorCallback) {
  judgePermission('photoLibrary', (result) => {
    if (result === 1) {
      successCallback && successCallback()
    } else {
      errorCallback && errorCallback('相册权限未授权')
    }
  })
}

/**
 * 请求麦克风权限
 * @param {Function} successCallback 成功回调
 * @param {Function} errorCallback 失败回调
 */
export function requestRecordPermission(successCallback, errorCallback) {
  judgePermission('record', (result) => {
    if (result === 1) {
      successCallback && successCallback()
    } else {
      errorCallback && errorCallback('麦克风权限未授权')
    }
  })
}

export default {
  judgePermission,
  checkPermission,
  gotoAppPermissionSetting,
  checkSystemEnableLocation,
  requestLocationPermission,
  requestCameraPermission,
  requestPhotoLibraryPermission,
  requestRecordPermission
}
