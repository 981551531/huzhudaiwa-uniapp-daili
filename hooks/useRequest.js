import { ref } from 'vue'

function resolveValue(value, params) {
  return typeof value === 'function' ? value(params) : value
}

export function useRequest(service, options = {}) {
  const {
    immediate = false,
    defaultParams = [],
    defaultValue = null,
    showError = true,
    onSuccess,
    onError
  } = options

  const loading = ref(false)
  const data = ref(defaultValue)
  const error = ref(null)
  const finished = ref(false)
  const paramsRef = ref(Array.isArray(defaultParams) ? defaultParams : [defaultParams])

  async function runAsync(...params) {
    const nextParams = params.length ? params : paramsRef.value
    paramsRef.value = nextParams
    loading.value = true
    finished.value = false
    error.value = null

    try {
      const result = await service(...nextParams)
      data.value = result
      finished.value = true

      if (typeof onSuccess === 'function') {
        onSuccess(result, nextParams)
      }

      return result
    } catch (err) {
      error.value = err

      if (showError && err?.message) {
        uni.showToast({
          title: err.message,
          icon: 'none'
        })
      }

      if (typeof onError === 'function') {
        onError(err, nextParams)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  function run(...params) {
    return runAsync(...params).catch(() => undefined)
  }

  function refresh() {
    return runAsync(...paramsRef.value)
  }

  function reset(nextValue = resolveValue(defaultValue, paramsRef.value)) {
    data.value = nextValue
    error.value = null
    loading.value = false
    finished.value = false
  }

  if (immediate) {
    run(...paramsRef.value)
  }

  return {
    loading,
    data,
    error,
    finished,
    params: paramsRef,
    run,
    runAsync,
    refresh,
    reset
  }
}

export default useRequest
