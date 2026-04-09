<template>
  <view>
    <!-- #ifdef MP -->
    <view v-if="showTestTag" class="test-env-tag">测试环境</view>
    <!-- #endif -->

    <GlobalLoading :visible="loadingVisible" :text="loadingText" />

    <LoginPopup
      v-if="showLoginPopup"
      v-model:visible="showLoginPopup"
      @success="handleLoginSuccess"
    />

    <WechatLoginPopup
      v-if="showWechatLoginPopup"
      v-model:visible="showWechatLoginPopup"
      @success="handleWechatLoginSuccess"
    />

    <BindMobilePopup
      v-if="showBindMobilePopup"
      v-model:visible="showBindMobilePopup"
      @success="handleBindMobileSuccess"
    />

    <PayPopup
      v-if="showPayPopup"
      v-model:visible="showPayPopup"
      :amount="payAmount"
      :order-id="payOrderId"
      :balance="userBalance"
      @pay="handlePay"
      @close="handlePayClose"
    />

    <AppUpdate ref="appUpdateRef" />
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import GlobalLoading from './GlobalLoading.vue'
import LoginPopup from './LoginPopup.vue'
import WechatLoginPopup from './WechatLoginPopup.vue'
import BindMobilePopup from './BindMobilePopup.vue'
import PayPopup from '../PayPopup/PayPopup.vue'
import AppUpdate from '../AppUpdate/AppUpdate.vue'

export default {
  name: 'PublicModule',
  components: {
    GlobalLoading,
    LoginPopup,
    WechatLoginPopup,
    BindMobilePopup,
    PayPopup,
    AppUpdate
  },
  props: {
    showTestEnvTag: {
      type: Boolean,
      default: true
    }
  },
  emits: ['loginSuccess', 'wechatLoginSuccess', 'bindMobileSuccess', 'paySuccess', 'payClose'],
  setup(props, { emit, expose }) {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const appUpdateRef = ref(null)

    const showTestTag = computed(() => props.showTestEnvTag && appStore.currentEnv !== 'production')
    const loadingVisible = computed(() => appStore.globalLoading)
    const loadingText = computed(() => appStore.globalLoadingText)
    const showLoginPopup = computed({
      get: () => appStore.showLoginPopup,
      set: (visible) => appStore.setLoginPopupVisible(visible)
    })
    const showWechatLoginPopup = computed({
      get: () => appStore.showWechatLoginPopup,
      set: (visible) => appStore.setWechatLoginPopupVisible(visible)
    })
    const showBindMobilePopup = computed({
      get: () => appStore.showBindMobilePopup,
      set: (visible) => appStore.setBindMobilePopupVisible(visible)
    })
    const showPayPopup = computed({
      get: () => appStore.showPayPopup,
      set: (visible) => {
        if (visible) {
          appStore.openPayPopup({
            amount: appStore.payAmount,
            orderId: appStore.payOrderId
          })
          return
        }

        appStore.closePayPopup()
      }
    })
    const payAmount = computed(() => appStore.payAmount)
    const payOrderId = computed(() => appStore.payOrderId)
    const userBalance = computed(() => userStore.userInfo?.balance || 0)

    function handleLoginSuccess(data) {
      emit('loginSuccess', data)
    }

    function handleWechatLoginSuccess(data) {
      emit('wechatLoginSuccess', data)
    }

    function handleBindMobileSuccess(data) {
      emit('bindMobileSuccess', data)
    }

    function handlePay(data) {
      emit('paySuccess', data)
    }

    function handlePayClose() {
      appStore.closePayPopup()
      emit('payClose')
    }

    function checkAppUpdate() {
      if (appUpdateRef.value) {
        appUpdateRef.value.checkUpdate()
      }
    }

    onMounted(() => {
      // #ifdef APP-PLUS
      checkAppUpdate()
      // #endif
    })

    expose({
      checkAppUpdate
    })

    return {
      appUpdateRef,
      showTestTag,
      loadingVisible,
      loadingText,
      showLoginPopup,
      showWechatLoginPopup,
      showBindMobilePopup,
      showPayPopup,
      payAmount,
      payOrderId,
      userBalance,
      handleLoginSuccess,
      handleWechatLoginSuccess,
      handleBindMobileSuccess,
      handlePay,
      handlePayClose,
      checkAppUpdate
    }
  }
}
</script>

<style lang="scss" scoped>
/* #ifdef MP */
.test-env-tag {
  position: fixed;
  top: 200px;
  right: 0;
  z-index: 99999;
  background-color: #1890ff;
  color: #fff;
  padding: 6px 12px;
  border-radius: 20px 0 0 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}
/* #endif */
</style>
