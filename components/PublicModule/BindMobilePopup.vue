<template>
  <u-popup :show="visible" mode="center" :round="20" @close="handleClose">
    <view class="bind-mobile-popup">
      <view class="popup-header">
        <text class="popup-title">绑定手机号</text>
        <view class="close-btn" @click="handleClose">
          <u-icon name="close" size="20" color="#999"></u-icon>
        </view>
      </view>

      <view class="popup-content">
        <text class="popup-desc">绑定手机号后可使用更多账户功能</text>

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

      <view class="popup-footer">
        <u-button type="primary" :loading="loading" @click="handleBind">确认绑定</u-button>
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <view class="popup-wechat">
        <view class="divider">
          <view class="divider-line"></view>
          <text class="divider-text">或</text>
          <view class="divider-line"></view>
        </view>
        <u-button type="default" open-type="getPhoneNumber" @getphonenumber="handleWechatBind">
          <u-icon name="weixin-fill" size="18" color="#07c160" style="margin-right: 8rpx;"></u-icon>
          微信快捷绑定
        </u-button>
      </view>
      <!-- #endif -->
    </view>
  </u-popup>
</template>

<script>
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store'
import { authApi } from '@/api/index.js'

export default {
  name: 'BindMobilePopup',
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
        await authApi.sendSmsCode({ phone: formData.phone, type: 'bind' })
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

    async function handleBind() {
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
        const result = await userStore.updateUserInfo({
          phone: formData.phone,
          code: formData.code
        })
        emit('success', result)
        handleClose()
        uni.showToast({ title: '绑定成功', icon: 'success' })
      } catch (error) {
        uni.showToast({ title: error.message || '绑定失败', icon: 'none' })
      } finally {
        loading.value = false
      }
    }

    async function handleWechatBind(e) {
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
        await userStore.fetchUserInfo()
        emit('success', result)
        handleClose()
        uni.showToast({ title: '绑定成功', icon: 'success' })
      } catch (error) {
        uni.showToast({ title: error.message || '绑定失败', icon: 'none' })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      countdown,
      formData,
      handleClose,
      handleSendCode,
      handleBind,
      handleWechatBind
    }
  }
}
</script>

<style lang="scss" scoped>
.bind-mobile-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.popup-title {
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

.popup-content {
  padding: 40rpx 32rpx;
}

.popup-desc {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: #999;
  margin-bottom: 32rpx;
}

.form-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.popup-footer {
  padding: 0 32rpx 32rpx;
}

.popup-wechat {
  padding: 0 32rpx 32rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #f0f0f0;
}

.divider-text {
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
