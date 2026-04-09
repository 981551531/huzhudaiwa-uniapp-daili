<template>
  <view class="page-container">
    <view class="page-content">
      <view class="card">
        <view class="card-header">
          <text class="card-title">环境信息</text>
          <u-tag :text="appStore.envLabel" type="primary" size="mini" plain />
        </view>
        <view class="info-row">
          <text class="info-label">当前环境</text>
          <text class="info-value">{{ appStore.currentEnv }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">接口域名</text>
          <text class="info-value text-sm">{{ appStore.envConfig.BASE_URL }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">主题模式</text>
          <text class="info-value">{{ appStore.themeMode }}</text>
          <u-button type="primary" size="mini" text="切换主题" @click="appStore.toggleTheme" />
        </view>
        <view class="info-row">
          <text class="info-label">网络状态</text>
          <u-tag :text="appStore.networkType" :type="appStore.isConnected ? 'success' : 'error'" size="mini" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">环境切换</text>
        <view class="env-buttons">
          <u-button
            v-for="env in envList"
            :key="env.value"
            :type="appStore.currentEnv === env.value ? 'primary' : 'info'"
            size="small"
            :text="env.label"
            :plain="appStore.currentEnv !== env.value"
            class="env-btn"
            @click="appStore.switchEnv(env.value)"
          />
        </view>
      </view>

      <view class="card">
        <text class="card-title">功能示例</text>
        <u-cell-group :border="false">
          <u-cell
            v-for="item in demoList"
            :key="item.path"
            :title="item.title"
            :label="item.desc"
            :isLink="true"
            :border="true"
            @click="navigateTo(item.path)"
          />
        </u-cell-group>
      </view>

      <view class="card">
        <text class="card-title">框架信息</text>
        <view v-for="item in frameworkInfo" :key="item.label" class="info-row">
          <text class="info-label">{{ item.label }}</text>
          <text class="info-value">{{ item.value }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/store'
import { ENV_TYPE } from '@/config/env.js'
import { PAGES } from '@/config/constants.js'

const appStore = useAppStore()

const envList = ref([
  { label: '开发', value: ENV_TYPE.DEV },
  { label: '测试', value: ENV_TYPE.TEST },
  { label: '预发布', value: ENV_TYPE.UAT },
  { label: '生产', value: ENV_TYPE.PROD }
])

const demoList = ref([
  {
    title: '请求示例',
    desc: '查看 HTTP 请求封装、重试、静默和防重复请求能力',
    path: PAGES.REQUEST_DEMO
  },
  {
    title: '状态管理示例',
    desc: '查看 Pinia 状态、用户信息和应用状态用法',
    path: PAGES.STORE_DEMO
  },
  {
    title: '框架能力示例',
    desc: '查看路由、缓存、Hooks、平台信息、弹窗、校验等能力',
    path: PAGES.FRAMEWORK_DEMO
  },
  {
    title: '增删改查示例',
    desc: '查看列表、详情、新增、修改、删除和登录守卫串联',
    path: PAGES.CRUD_DEMO
  },
  {
    title: '组件示例',
    desc: '查看 uview-plus 常用组件展示',
    path: PAGES.COMPONENT_DEMO
  },
  {
    title: '工具方法示例',
    desc: '查看格式化、校验、节流、防抖等工具函数',
    path: PAGES.UTILS_DEMO
  }
])

const frameworkInfo = ref([
  { label: '框架', value: 'uni-app (Vue 3)' },
  { label: 'UI 组件', value: 'uview-plus 3.x' },
  { label: '状态管理', value: 'Pinia 2.x' },
  { label: '构建工具', value: 'Vite' },
  { label: '模板类型', value: 'HBuilderX 模板' }
])

function navigateTo(path) {
  uni.navigateTo({ url: path })
}
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 20rpx;
  display: block;
}

.card-header .card-title {
  margin-bottom: 0;
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
}

.env-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.env-btn {
  flex: 1;
  min-width: 140rpx;
}
</style>
