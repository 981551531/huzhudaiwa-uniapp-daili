import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/utils/request.js'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/auth.js'
import { PAGES } from '@/config/constants.js'
import { useAppStore } from './app.js'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userInfo = ref(getUserInfo())

  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.name || userInfo.value?.nickname || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  const userId = computed(() => userInfo.value?.id || '')

  async function login(loginData) {
    try {
      const res = await http.post('/auth/login', loginData, { noAuth: true })
      await applyLoginResult(res)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function applyLoginResult(loginResult = {}) {
    const nextToken = loginResult.token || loginResult.accessToken || ''
    const nextRefreshToken = loginResult.refreshToken || ''
    const nextUserInfo = loginResult.userInfo || loginResult.user || null

    if (nextToken) {
      token.value = nextToken
      setToken(nextToken, nextRefreshToken)
    }

    if (nextUserInfo) {
      userInfo.value = nextUserInfo
      setUserInfo(nextUserInfo)
      return nextUserInfo
    }

    return fetchUserInfo()
  }

  async function fetchUserInfo() {
    try {
      const res = await http.get('/user/info')
      userInfo.value = res
      setUserInfo(res)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  function setUserInfoState(data) {
    userInfo.value = data
    setUserInfo(data)
  }

  async function updateUserInfo(data) {
    try {
      const res = await http.post('/user/update', data)
      const nextUserInfo = { ...(userInfo.value || {}), ...data, ...(res || {}) }
      setUserInfoState(nextUserInfo)
      return res
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async function logout() {
    const appStore = useAppStore()

    try {
      await http.post('/auth/logout', {}, { silent: true })
    } catch (error) {
      console.warn('Logout request failed', error)
    } finally {
      token.value = ''
      userInfo.value = null
      removeToken()
      removeUserInfo()
      appStore.resetGlobalUiState()

      uni.reLaunch({ url: PAGES.LOGIN })
    }
  }

  function resetState() {
    const appStore = useAppStore()

    token.value = ''
    userInfo.value = null
    removeToken()
    removeUserInfo()
    appStore.resetGlobalUiState()
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    userName,
    avatar,
    userId,
    login,
    applyLoginResult,
    fetchUserInfo,
    setUserInfoState,
    updateUserInfo,
    logout,
    resetState
  }
})

