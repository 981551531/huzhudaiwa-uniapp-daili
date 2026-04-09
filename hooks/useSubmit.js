import { ref } from 'vue'

function showToast(message, icon = 'none') {
  if (!message) {
    return
  }

  uni.showToast({
    title: message,
    icon
  })
}

export function useSubmit(submitFn, options = {}) {
  const {
    validate,
    successText = '',
    errorText = '',
    showSuccessToast = !!successText,
    showErrorToast = true,
    onSuccess,
    onError
  } = options

  const submitting = ref(false)

  async function submitAsync(...args) {
    if (submitting.value) {
      return Promise.reject(new Error('请勿重复提交'))
    }

    if (typeof validate === 'function') {
      const valid = await validate(...args)
      if (!valid) {
        return Promise.reject(new Error('表单校验未通过'))
      }
    }

    submitting.value = true

    try {
      const result = await submitFn(...args)

      if (showSuccessToast) {
        showToast(successText, 'success')
      }

      if (typeof onSuccess === 'function') {
        await onSuccess(result, args)
      }

      return result
    } catch (error) {
      const message = errorText || error?.message || '提交失败'

      if (showErrorToast) {
        showToast(message)
      }

      if (typeof onError === 'function') {
        onError(error, args)
      }

      throw error
    } finally {
      submitting.value = false
    }
  }

  function submit(...args) {
    return submitAsync(...args).catch(() => undefined)
  }

  return {
    submitting,
    submit,
    submitAsync
  }
}

export default useSubmit
