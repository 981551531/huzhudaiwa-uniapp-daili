/**
 * Pinia 状态管理入口
 */

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

// 统一导出所有 store 模块
export { useUserStore } from './modules/user.js'
export { useAppStore } from './modules/app.js'
export { useConfigStore } from './modules/config.js'
export { useDictStore } from './modules/dict.js'
