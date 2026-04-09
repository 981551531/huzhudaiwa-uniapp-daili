import { computed } from 'vue'
import { useUserStore } from '@/store'
import { toLogin } from '@/utils/router.js'

export function useLoginGuard(options = {}) {
  const {
    redirect = true,
    onReject
  } = options

  const userStore = useUserStore()
  const isLoggedIn = computed(() => userStore.isLoggedIn)

  function checkLogin() {
    if (isLoggedIn.value) {
      return true
    }

    toLogin(redirect)

    if (typeof onReject === 'function') {
      onReject()
    }

    return false
  }

  async function runWithLogin(handler, ...args) {
    if (!checkLogin()) {
      return false
    }

    if (typeof handler !== 'function') {
      return true
    }

    return handler(...args)
  }

  function redirectToLogin() {
    return toLogin(redirect)
  }

  return {
    isLoggedIn,
    checkLogin,
    runWithLogin,
    redirectToLogin
  }
}

export default useLoginGuard
