import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getCache, setCache, removeCache } from '@/utils/cache.js'

const CONFIG_CACHE_KEY = 'config_store'

export const useConfigStore = defineStore('config', () => {
  const appConfig = ref(getCache(CONFIG_CACHE_KEY, {}))
  const remoteConfig = ref({})
  const currentCity = ref('')
  const siteInfo = ref(null)
  const versionInfo = ref(null)
  const loaded = ref(false)

  const settings = computed(() => ({
    ...appConfig.value,
    remoteConfig: remoteConfig.value,
    currentCity: currentCity.value,
    siteInfo: siteInfo.value,
    versionInfo: versionInfo.value
  }))

  function syncCache() {
    setCache(CONFIG_CACHE_KEY, {
      ...appConfig.value,
      remoteConfig: remoteConfig.value,
      currentCity: currentCity.value,
      siteInfo: siteInfo.value,
      versionInfo: versionInfo.value
    })
  }

  function initConfig(payload = {}) {
    const cached = getCache(CONFIG_CACHE_KEY, {})
    const source = {
      ...cached,
      ...payload
    }

    appConfig.value = source
    remoteConfig.value = source.remoteConfig || {}
    currentCity.value = source.currentCity || ''
    siteInfo.value = source.siteInfo || null
    versionInfo.value = source.versionInfo || null
    loaded.value = true
    syncCache()
  }

  function setAppConfig(payload = {}) {
    appConfig.value = {
      ...appConfig.value,
      ...payload
    }
    syncCache()
  }

  function setRemoteConfig(payload = {}) {
    remoteConfig.value = {
      ...remoteConfig.value,
      ...payload
    }
    syncCache()
  }

  function setCurrentCity(city = '') {
    currentCity.value = city
    syncCache()
  }

  function setSiteInfo(payload = null) {
    siteInfo.value = payload
    syncCache()
  }

  function setVersionInfo(payload = null) {
    versionInfo.value = payload
    syncCache()
  }

  function resetConfig() {
    appConfig.value = {}
    remoteConfig.value = {}
    currentCity.value = ''
    siteInfo.value = null
    versionInfo.value = null
    loaded.value = false
    removeCache(CONFIG_CACHE_KEY)
  }

  return {
    appConfig,
    remoteConfig,
    currentCity,
    siteInfo,
    versionInfo,
    loaded,
    settings,
    initConfig,
    setAppConfig,
    setRemoteConfig,
    setCurrentCity,
    setSiteInfo,
    setVersionInfo,
    resetConfig
  }
})
