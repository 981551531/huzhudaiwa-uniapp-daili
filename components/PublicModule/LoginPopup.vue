<template>
  <u-popup :show="visible" mode="center" :round="20" @close="handleClose">
    <view class="login-popup">
      <view class="login-header">
        <text class="login-title">登录</text>
        <view class="close-btn" @click="handleClose">
          <u-icon name="close" size="20" color="#999"></u-icon>
        </view>
      </view>

      <view class="login-content">
        <view class="form-item">
          <u-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            clearable
          />
        </view>
        <view class="form-item">
          <u-input
            v-model="formData.code"
            placeholder="请输入验证码"
            type="number"
            maxlength="6"
            clearable
          >
            <template #suffix>
              <u-button type="primary" size="small" :disabled="countdown > 0" @click="handleSendCode">
                {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
              </u-button>
            </template>
          </u-input>
        </view>
      </view>

      <view class="login-footer">
        <u-button type="primary" :loading="loading" @click="handleLogin">登录</u-button>
      </view>

      <view class="login-other">
        <text class="other-text">其他登录方式</text>
        <view class="other-methods">
          <view class="method-item" @click="handleWechatLogin">
            <u-icon name="weixin-circle-fill" size="40" color="#07c160"></u-icon>
            <text class="method-text">微信登录</text>
          </view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAppStore, useUserStore } from '@/store'
import { authApi } from '@/api/index.js'

export default {
  name: 'LoginPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'success'],
  setup(props, { emit }) {
    const appStore = useAppStore()
    const userStore = useUserStore()
    const loading = ref(false)
    const countdown = ref(0)
    const formData = reactive({
      phone: '',
      code: ''
    })

    function handleClose() {
      emit('update:visible', false)
    }

    async function handleSendCode() {
      if (!formData.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }

      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        uni.showToast({ title: '手机号格式不正确', icon: 'none' })
        return
      }

      try {
        await authApi.sendSmsCode({ phone: formData.phone, type: 'login' })
        uni.showToast({ title: '验证码已发送', icon: 'success' })
        countdown.value = 60
        const timer = setInterval(() => {
          countdown.value -= 1
          if (countdown.value <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      } catch (error) {
        uni.showToast({ title: error.message || '发送失败', icon: 'none' })
      }
    }

    async function handleLogin() {
      if (!formData.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' })
        return
      }

      if (!formData.code) {
        uni.showToast({ title: '请输入验证码', icon: 'none' })
        return
      }

      loading.value = true
      try {
        const result = await authApi.loginByCode({
          phone: formData.phone,
          code: formData.code
        })
        await userStore.applyLoginResult(result)
        emit('success', result)
        handleClose()
      } catch (error) {
        uni.showToast({ title: error.message || '登录失败', icon: 'none' })
      } finally {
        loading.value = false
      }
    }

    function handleWechatLogin() {
      handleClose()
      appStore.setWechatLoginPopupVisible(true)
    }

    return {
      loading,
      countdown,
      formData,
      handleClose,
      handleSendCode,
      handleLogin,
      handleWechatLogin
    }
  }
}
</script>

<style lang="scss" scoped>
.login-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.login-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.login-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.close-btn {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 10rpx;
}

.login-content {
  padding: 40rpx 32rpx;
}

.form-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.login-footer {
  padding: 0 32rpx 32rpx;
}

.login-other {
  padding: 32rpx;
  border-top: 1rpx solid #f0f0f0;
}

.other-text {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 24rpx;
}

.other-methods {
  display: flex;
  justify-content: center;
  gap: 60rpx;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.method-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}
</style>
