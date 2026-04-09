<template>
  <view class="page-container">
    <view class="page-content">
      <view class="card">
        <text class="card-title">用户状态（useUserStore）</text>

        <view class="info-row">
          <text class="info-label">登录状态：</text>
          <u-tag :text="userStore.isLoggedIn ? '已登录' : '未登录'" :type="userStore.isLoggedIn ? 'success' : 'warning'" size="mini" />
        </view>
        <view class="info-row">
          <text class="info-label">用户名：</text>
          <text class="info-value">{{ userStore.userName || '未设置' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">Token：</text>
          <text class="info-value text-ellipsis">{{ userStore.token || '无' }}</text>
        </view>

        <view class="btn-group">
          <u-button type="primary" size="small" text="模拟登录" @click="mockLogin" />
          <u-button type="warning" size="small" text="更新信息" @click="mockUpdateInfo" />
          <u-button type="error" size="small" text="退出登录" @click="mockLogout" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">应用状态（useAppStore）</text>

        <view class="info-row">
          <text class="info-label">主题模式：</text>
          <text class="info-value">{{ appStore.themeMode }}</text>
          <u-button type="primary" size="mini" text="切换" @click="appStore.toggleTheme" />
        </view>
        <view class="info-row">
          <text class="info-label">暗黑模式：</text>
          <u-tag :text="appStore.isDarkMode ? '是' : '否'" :type="appStore.isDarkMode ? 'warning' : 'info'" size="mini" />
        </view>
        <view class="info-row">
          <text class="info-label">当前环境：</text>
          <text class="info-value">{{ appStore.envLabel }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">网络状态：</text>
          <u-tag :text="appStore.isConnected ? '已连接' : '已断开'" :type="appStore.isConnected ? 'success' : 'error'" size="mini" />
        </view>
        <view class="info-row">
          <text class="info-label">全局加载：</text>
          <u-switch v-model="appStore.globalLoading" size="20" activeColor="#2979ff" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">使用方式</text>
        <view class="code-block">
          <text class="code-text">// 在 setup 中使用
import { useUserStore, useAppStore } from '@/store'

const userStore = useUserStore()
const appStore = useAppStore()

// 读取状态
const loggedIn = userStore.isLoggedIn
const themeMode = appStore.themeMode

// 调用 Action
await userStore.login({ username, password })
appStore.toggleTheme()
appStore.switchEnv('test')</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useUserStore, useAppStore } from '@/store'
import { setToken, setUserInfo } from '@/utils/auth.js'

const userStore = useUserStore()
const appStore = useAppStore()

function mockLogin() {
  const mockToken = `mock_token_${Date.now()}`
  const mockUser = {
    id: 1,
    name: '张三',
    nickname: '测试用户',
    avatar: '',
    phone: '13800138000'
  }

  userStore.token = mockToken
  userStore.userInfo = mockUser
  setToken(mockToken)
  setUserInfo(mockUser)

  uni.showToast({ title: '模拟登录成功', icon: 'success' })
}

function mockUpdateInfo() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  const updatedInfo = {
    ...userStore.userInfo,
    nickname: `更新后的昵称_${Date.now()}`
  }

  userStore.userInfo = updatedInfo
  setUserInfo(updatedInfo)
  uni.showToast({ title: '信息已更新', icon: 'success' })
}

function mockLogout() {
  userStore.resetState()
  uni.showToast({ title: '已退出登录', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 20rpx;
  display: block;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;

  .info-label {
    font-size: 26rpx;
    color: $text-secondary;
    width: 160rpx;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 26rpx;
    color: $text-primary;
    flex: 1;
    margin-right: 16rpx;
  }

  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 24rpx;
}

.code-block {
  background-color: #1e1e1e;
  border-radius: $radius-base;
  padding: 24rpx;
  overflow-x: auto;
}

.code-text {
  font-size: 22rpx;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
