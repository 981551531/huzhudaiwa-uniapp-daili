<template>
  <u-popup :show="visible" mode="center" :round="20" @close="handleClose">
    <view class="wechat-login-popup">
      <view class="login-header">
        <text class="login-title">微信登录</text>
        <view class="close-btn" @click="handleClose">
          <u-icon name="close" size="20" color="#999"></u-icon>
        </view>
      </view>

      <view class="login-content">
        <view class="wechat-icon">
          <u-icon name="weixin-circle-fill" size="80" color="#07c160"></u-icon>
        </view>
        <text class="login-desc">使用微信快捷登录</text>
        <text class="login-tip">登录后可获得更完整的账户能力</text>
      </view>

      <view class="login-footer">
        <!-- #ifdef MP-WEIXIN -->
        <u-button
          type="primary"
          :loading="loading"
          open-type="getPhoneNumber"
          @getphonenumber="handleGetPhoneNumber"
        >
          授权手机号登录
        </u-button>
        <!-- #endif -->

        <!-- #ifdef APP-PLUS || H5 -->
        <u-button type="primary" :loading="loading" @click="handleWechatLogin">
          微信授权登录
        </u-button>
        <!-- #endif -->

        <u-button type="default" @click="handleCancel">取消</u-button>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { authApi } from '@/api/index.js'

export default {
  name: 'WechatLoginPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'success'],
  setup(props, { emit }) {
    const userStore = useUserStore()
    const loading = ref(false)

    function handleClose() {
      emit('update:visible', false)
    }

    function handleCancel() {
      handleClose()
    }

    async function handleGetPhoneNumber(e) {
      if (e.detail.errMsg !== 'getPhoneNumber:ok') {
        uni.showToast({ title: '授权失败', icon: 'none' })
        return
      }

      loading.value = true
      try {
        const result = await authApi.bindWechatMobile({
          code: e.detail.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
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

    async function handleWechatLogin() {
      // #ifdef APP-PLUS
      loading.value = true
      try {
        const result = await authApi.wechatLogin({})
        await userStore.applyLoginResult(result)
        emit('success', result)
        handleClose()
      } catch (error) {
        uni.showToast({ title: error.message || '登录失败', icon: 'none' })
      } finally {
        loading.value = false
      }
      // #endif

      // #ifdef H5
      uni.showToast({ title: '请在微信环境中使用', icon: 'none' })
      // #endif
    }

    return {
      loading,
      handleClose,
      handleCancel,
      handleGetPhoneNumber,
      handleWechatLogin
    }
  }
}
</script>

<style lang="scss" scoped>
.wechat-login-popup {
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
  padding: 60rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wechat-icon {
  margin-bottom: 32rpx;
}

.login-desc {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}

.login-tip {
  font-size: 26rpx;
  color: #999;
}

.login-footer {
  padding: 0 32rpx 32rpx;

  .u-button {
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
