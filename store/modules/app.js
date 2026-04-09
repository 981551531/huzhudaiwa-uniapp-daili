import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTheme, getThemeCssVars } from '@/config/theme.js'
import { STORAGE_KEYS } from '@/config/constants.js'
import { getEnv, setEnv, getEnvConfig, ENV_TYPE } from '@/config/env.js'

export const useAppStore = defineStore('app', () => {
  const themeMode = ref(uni.getStorageSync(STORAGE_KEYS.THEME) || 'light')
  const currentEnv = ref(getEnv())
  const networkType = ref('unknown')
  const isConnected = ref(true)
  const systemInfo = ref(null)

  const globalLoading = ref(false)
  const globalLoadingText = ref('加载中...')
  const showLoginPopup = ref(false)
  const showWechatLoginPopup = ref(false)
  const showBindMobilePopup = ref(false)
  const showPayPopup = ref(false)
  const payAmount = ref(0)
  const payOrderId = ref('')

  const themeConfig = computed(() => getTheme(themeMode.value))
  const themeCssVars = computed(() => getThemeCssVars(themeMode.value))
  const isDarkMode = computed(() => themeMode.value === 'dark')
  const envConfig = computed(() => getEnvConfig())
  const envLabel = computed(() => {
    const labels = {
      [ENV_TYPE.DEV]: '开发环境',
      [ENV_TYPE.TEST]: '测试环境',
      [ENV_TYPE.UAT]: '预发布环境',
      [ENV_TYPE.PROD]: '生产环境'
    }

    return labels[currentEnv.value] || '未知环境'
  })

  function toggleTheme() {
    setTheme(themeMode.value === 'light' ? 'dark' : 'light')
  }

  function setTheme(mode) {
    themeMode.value = mode
    uni.setStorageSync(STORAGE_KEYS.THEME, mode)
    applyTheme()
  }

  function applyTheme() {
    const theme = getTheme(themeMode.value)

    uni.setNavigationBarColor({
      frontColor: themeMode.value === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: theme.navBgColor
    })
  }

  function switchEnv(env) {
    setEnv(env)
    currentEnv.value = env
  }

  function initNetworkListener() {
    uni.getNetworkType({
      success: (res) => {
        networkType.value = res.networkType
        isConnected.value = res.networkType !== 'none'
      }
    })

    uni.onNetworkStatusChange((res) => {
      networkType.value = res.networkType
      isConnected.value = res.isConnected

      if (!res.isConnected) {
        uni.showToast({ title: '网络已断开', icon: 'none' })
      }
    })
  }

  function initSystemInfo() {
    try {
      systemInfo.value = uni.getSystemInfoSync()
    } catch (error) {
      console.warn('Failed to get system info', error)
    }
  }

  function setGlobalLoading(status, text = globalLoadingText.value) {
    globalLoading.value = status
    globalLoadingText.value = text
  }

  function openGlobalLoading(text = '加载中...') {
    setGlobalLoading(true, text)
  }

  function closeGlobalLoading() {
    setGlobalLoading(false, '加载中...')
  }

  function setLoginPopupVisible(visible) {
    showLoginPopup.value = visible
  }

  function setWechatLoginPopupVisible(visible) {
    showWechatLoginPopup.value = visible
  }

  function setBindMobilePopupVisible(visible) {
    showBindMobilePopup.value = visible
  }

  function openPayPopup({ amount = 0, orderId = '' } = {}) {
    payAmount.value = amount
    payOrderId.value = orderId
    showPayPopup.value = true
  }

  function closePayPopup() {
    showPayPopup.value = false
  }

  function resetGlobalUiState() {
    closeGlobalLoading()
    showLoginPopup.value = false
    showWechatLoginPopup.value = false
    showBindMobilePopup.value = false
    showPayPopup.value = false
    payAmount.value = 0
    payOrderId.value = ''
  }

  function initApp() {
    initSystemInfo()
    initNetworkListener()
    applyTheme()
  }

  return {
    themeMode,
    currentEnv,
    networkType,
    isConnected,
    systemInfo,
    globalLoading,
    globalLoadingText,
    showLoginPopup,
    showWechatLoginPopup,
    showBindMobilePopup,
    showPayPopup,
    payAmount,
    payOrderId,
    themeConfig,
    themeCssVars,
    isDarkMode,
    envConfig,
    envLabel,
    toggleTheme,
    setTheme,
    applyTheme,
    switchEnv,
    initNetworkListener,
    initSystemInfo,
    setGlobalLoading,
    openGlobalLoading,
    closeGlobalLoading,
    setLoginPopupVisible,
    setWechatLoginPopupVisible,
    setBindMobilePopupVisible,
    openPayPopup,
    closePayPopup,
    resetGlobalUiState,
    initApp
  }
})
