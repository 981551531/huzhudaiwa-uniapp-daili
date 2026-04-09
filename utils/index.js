/**
 * 工具函数统一导出
 */

export * from './tools.js'
export * from './auth.js'
export * from './request.js'
export * from './cache.js'
export * from './router.js'
export * from './emitter.js'
export * from './platform.js'
export * from './device.js'
export * from './modal.js'
export * from './validator.js'
export * from './location.js'
export * from './upload.js'
export * from './permission.js'
export * from './pay.js'
export {
  checkAppUpdate,
  mpUpdate,
  getSceneParams,
  calculateCacheSize,
  clearCache as clearAppCache,
  exitApp,
  restartApp
} from './app.js'

import * as tools from './tools.js'
import * as auth from './auth.js'
import * as request from './request.js'
import * as cache from './cache.js'
import * as router from './router.js'
import * as emitter from './emitter.js'
import * as platform from './platform.js'
import * as device from './device.js'
import * as modal from './modal.js'
import * as validator from './validator.js'
import * as location from './location.js'
import * as upload from './upload.js'
import * as permission from './permission.js'
import * as pay from './pay.js'
import * as app from './app.js'

export default {
  ...tools,
  ...auth,
  ...request,
  ...cache,
  ...router,
  ...emitter,
  ...platform,
  ...device,
  ...modal,
  ...validator,
  ...location,
  ...upload,
  ...permission,
  ...pay,
  ...app
}
