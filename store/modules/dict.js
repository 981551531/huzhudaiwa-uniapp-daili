import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getCache, setCache, clearCache } from '@/utils/cache.js'

const DICT_CACHE_PREFIX = 'dict:'

export const useDictStore = defineStore('dict', () => {
  const dictMap = ref({})
  const loadingMap = ref({})

  const dictTypes = computed(() => Object.keys(dictMap.value))

  function getCacheKey(type) {
    return `${DICT_CACHE_PREFIX}${type}`
  }

  function setDict(type, list = []) {
    dictMap.value[type] = Array.isArray(list) ? list : []
    setCache(getCacheKey(type), dictMap.value[type])
  }

  function getDictList(type) {
    if (!dictMap.value[type]) {
      dictMap.value[type] = getCache(getCacheKey(type), [])
    }

    return dictMap.value[type] || []
  }

  function getDictLabel(type, value, labelKey = 'label', valueKey = 'value') {
    const target = getDictList(type).find((item) => item?.[valueKey] === value)
    return target?.[labelKey] ?? ''
  }

  async function fetchDict(type, service, options = {}) {
    const { force = false } = options

    if (!type || typeof service !== 'function') {
      return []
    }

    if (!force) {
      const cached = getDictList(type)
      if (cached.length) {
        return cached
      }
    }

    loadingMap.value[type] = true

    try {
      const result = await service(type)
      const list = Array.isArray(result) ? result : result?.list || result?.data || []
      setDict(type, list)
      return list
    } finally {
      loadingMap.value[type] = false
    }
  }

  async function fetchBatchDict(types = [], service, options = {}) {
    const entries = await Promise.all(
      types.map(async (type) => {
        const list = await fetchDict(type, service, options)
        return [type, list]
      })
    )

    return Object.fromEntries(entries)
  }

  function clearDict(type) {
    if (type) {
      delete dictMap.value[type]
      clearCache(getCacheKey(type))
      return
    }

    dictMap.value = {}
    loadingMap.value = {}
    clearCache(DICT_CACHE_PREFIX)
  }

  return {
    dictMap,
    loadingMap,
    dictTypes,
    setDict,
    getDictList,
    getDictLabel,
    fetchDict,
    fetchBatchDict,
    clearDict
  }
})
