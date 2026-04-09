/**
 * 配置文件统一导出
 */

export * from './env.js'
export * from './constants.js'
export * from './dict.js'
export * from './enum.js'

import env from './env.js'
import constants from './constants.js'
import dict from './dict.js'
import enumConfig from './enum.js'

export default {
  ...env,
  ...constants,
  ...dict,
  ...enumConfig
}
