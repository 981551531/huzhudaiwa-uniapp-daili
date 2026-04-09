<template>
  <view class="login-page">
    <!-- 顶部区域 -->
    <view class="login-header">
      <view class="login-logo">
        <u-icon name="home" size="80" color="#1890FF" />
      </view>
      <text class="login-title">代理商管理系统</text>
      <text class="login-subtitle">互助带娃平台</text>
    </view>

    <!-- 中部表单区 -->
    <view class="login-form">
      <u-form ref="formRef" :model="formData" :rules="rules" labelWidth="0">
        <u-form-item prop="account">
          <u-input
            v-model="formData.account"
            placeholder="请输入手机号或用户名"
            prefixIcon="account"
            prefixIconStyle="font-size: 44rpx; color: #8C8C8C"
            clearable
            :customStyle="inputStyle"
          />
        </u-form-item>

        <u-form-item prop="password">
          <u-input
            v-model="formData.password"
            placeholder="请输入密码"
            :password="!showPassword"
            prefixIcon="lock"
            prefixIconStyle="font-size: 44rpx; color: #8C8C8C"
            :customStyle="inputStyle"
          >
            <template #suffix>
              <u-icon
                :name="showPassword ? 'eye-fill' : 'eye-off'"
                size="40"
                color="#8C8C8C"
                @click="showPassword = !showPassword"
              />
            </template>
          </u-input>
        </u-form-item>

        <!-- 底部操作区 -->
        <u-button
          type="primary"
          text="登录"
          :loading="loading"
          :disabled="!canLogin || loading"
          @click="handleLogin"
          :customStyle="loginBtnStyle"
        />

        <view class="forget-tip">
          <text class="forget-text">忘记密码请联系平台管理员</text>
        </view>
      </u-form>
    </view>

    <!-- 底部版权信息 -->
    <view class="login-footer">
      <text class="footer-text">互助带娃平台 - 代理商专用</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 表单引用
const formRef = ref(null)
const loading = ref(false)
const showPassword = ref(false)

// 表单数据
const formData = reactive({
  account: 'agent_beijing',
  password: '123456'
})

// 表单校验规则
const rules = reactive({
  account: [{ required: true, message: '请输入手机号或用户名', trigger: ['blur', 'change'] }],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
    { min: 6, message: '密码不少于6位', trigger: ['blur'] }
  ]
})

// 输入框样式
const inputStyle = {
  backgroundColor: '#F5F5F5',
  borderRadius: '8rpx',
  padding: '24rpx'
}

// 登录按钮样式
const loginBtnStyle = computed(() => ({
  marginTop: '60rpx',
  height: '96rpx',
  borderRadius: '12rpx',
  backgroundColor: canLogin.value ? '#1890FF' : '#91caff',
  border: 'none'
}))

// 是否可以登录
const canLogin = computed(() => {
  return formData.account.trim() !== '' && formData.password.trim() !== ''
})

// 页面加载
onLoad(() => {
  // 检查是否已登录
})

// 表单校验
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

// 登录处理
async function handleLogin() {
  const valid = await validateForm()
  if (!valid) return

  loading.value = true
  
  // 模拟登录请求
  setTimeout(() => {
    loading.value = false
    
    // 模拟登录成功，缓存代理商信息
    const agentInfo = {
      id: 1,
      name: '北京市朝阳区代理',
      contactName: '张经理',
      contactPhone: '138****8888',
      regionName: '北京市朝阳区',
      token: 'mock_token_123456'
    }
    
    uni.setStorageSync('agentInfo', agentInfo)
    uni.setStorageSync('token', agentInfo.token)
    
    uni.showToast({ 
      title: '登录成功', 
      icon: 'success' 
    })
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 300)
  }, 1500)
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  padding: 0 60rpx;
}

.login-header {
  padding-top: 180rpx;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .login-logo {
    width: 140rpx;
    height: 140rpx;
    border-radius: 28rpx;
    background: linear-gradient(135deg, #e6f4ff, #bae0ff);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32rpx;
  }

  .login-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #262626;
    margin-bottom: 12rpx;
  }

  .login-subtitle {
    font-size: 26rpx;
    color: #8C8C8C;
  }
}

.login-form {
  flex: 1;
}

.forget-tip {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;

  .forget-text {
    font-size: 24rpx;
    color: #8C8C8C;
  }
}

.login-footer {
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
  padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));

  .footer-text {
    font-size: 22rpx;
    color: #BFBFBF;
  }
}
</style>
