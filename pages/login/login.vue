<template>
  <view class="login-page">
    <view class="login-header">
      <view class="login-logo">
        <u-icon name="home" size="80" color="#2979ff" />
      </view>
      <text class="login-title">欢迎登录</text>
      <text class="login-subtitle">uni-app Vue3 基础模板</text>
    </view>

    <view class="login-form">
      <u-form ref="formRef" :model="formData" :rules="rules" labelWidth="0">
        <u-form-item prop="username">
          <u-input
            v-model="formData.username"
            placeholder="请输入用户名"
            prefixIcon="account"
            prefixIconStyle="font-size: 44rpx; color: #909399"
            clearable
          />
        </u-form-item>

        <u-form-item prop="password">
          <u-input
            v-model="formData.password"
            placeholder="请输入密码"
            :password="!showPassword"
            prefixIcon="lock"
            prefixIconStyle="font-size: 44rpx; color: #909399"
          >
            <template #suffix>
              <u-icon
                :name="showPassword ? 'eye-fill' : 'eye-off'"
                size="40"
                color="#909399"
                @click="showPassword = !showPassword"
              />
            </template>
          </u-input>
        </u-form-item>

        <view class="form-extra">
          <u-checkbox-group v-model="rememberMe">
            <u-checkbox label="记住账号" name="remember" shape="circle" activeColor="#2979ff" />
          </u-checkbox-group>
          <text class="forget-link" @click="handleForget">忘记密码？</text>
        </view>

        <u-button
          type="primary"
          text="登录"
          :loading="loading"
          :disabled="loading"
          @click="handleLogin"
          customStyle="margin-top: 40rpx; height: 88rpx; border-radius: 44rpx;"
        />
      </u-form>

      <view class="other-login">
        <view class="divider-text">
          <view class="divider-line" />
          <text class="divider-label">其他登录方式</text>
          <view class="divider-line" />
        </view>
        <view class="social-icons">
          <view class="social-item" @click="handleWechatLogin">
            <u-icon name="weixin-fill" size="48" color="#07c160" />
          </view>
        </view>
      </view>
    </view>

    <view class="login-footer">
      <text class="footer-text">登录即表示同意</text>
      <text class="footer-link">《用户协议》</text>
      <text class="footer-text">和</text>
      <text class="footer-link">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { PAGES } from '@/config/constants.js'

const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref([])
const redirectUrl = ref('')

const formData = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 6, message: '密码不少于 6 位', trigger: ['blur'] }
  ]
})

onLoad((options) => {
  redirectUrl.value = options?.redirect ? decodeURIComponent(options.redirect) : ''
})

async function validateForm() {
  if (!formRef.value?.validate) {
    return true
  }

  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

function goAfterLogin() {
  if (redirectUrl.value && redirectUrl.value !== PAGES.HOME) {
    uni.redirectTo({ url: redirectUrl.value })
    return
  }

  uni.switchTab({ url: PAGES.HOME })
}

async function handleLogin() {
  const valid = await validateForm()
  if (!valid) {
    return
  }

  loading.value = true
  try {
    await userStore.login({ ...formData })
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      goAfterLogin()
    }, 300)
  } catch (error) {
    uni.showToast({ title: error.message || '登录失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function handleForget() {
  uni.showToast({ title: '忘记密码功能待实现', icon: 'none' })
}

function handleWechatLogin() {
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '请使用页面内微信授权流程', icon: 'none' })
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '仅微信环境支持', icon: 'none' })
  // #endif
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: $bg-white;
  display: flex;
  flex-direction: column;
  padding: 0 60rpx;
}

.login-header {
  padding-top: 200rpx;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .login-logo {
    width: 140rpx;
    height: 140rpx;
    border-radius: 28rpx;
    background: linear-gradient(135deg, #e8f0fe, #d4e4fd);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32rpx;
  }

  .login-title {
    font-size: 48rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 12rpx;
  }

  .login-subtitle {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

.login-form {
  flex: 1;
}

.form-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;

  .forget-link {
    font-size: 26rpx;
    color: $primary;
  }
}

.other-login {
  margin-top: 80rpx;

  .divider-text {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;

    .divider-line {
      flex: 1;
      height: 1rpx;
      background-color: $border-light;
    }

    .divider-label {
      padding: 0 24rpx;
      font-size: 24rpx;
      color: $text-placeholder;
    }
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 60rpx;

    .social-item {
      width: 88rpx;
      height: 88rpx;
      border-radius: 50%;
      background-color: $bg-page;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.login-footer {
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .footer-text {
    font-size: 22rpx;
    color: $text-placeholder;
  }

  .footer-link {
    font-size: 22rpx;
    color: $primary;
  }
}
</style>
