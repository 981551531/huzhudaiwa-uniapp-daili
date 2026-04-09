<template>
  <view class="page-container">
    <view class="page-content">
      <view class="card">
        <text class="card-title">基本请求示例</text>
        <text class="card-desc">演示 GET / POST / PUT / DELETE 请求方法</text>

        <view class="btn-group">
          <u-button type="primary" size="small" text="GET 请求" :loading="getLoading" @click="handleGet" />
          <u-button type="success" size="small" text="POST 请求" :loading="postLoading" @click="handlePost" />
          <u-button type="warning" size="small" text="PUT 请求" @click="handlePut" />
          <u-button type="error" size="small" text="DELETE 请求" @click="handleDelete" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">请求配置示例</text>

        <u-cell-group :border="false">
          <u-cell title="带 Loading 请求" isLink @click="handleWithLoading" />
          <u-cell title="静默请求（不提示错误）" isLink @click="handleSilent" />
          <u-cell title="防重复请求" isLink @click="handleNoRepeat" />
          <u-cell title="自定义超时" isLink @click="handleTimeout" />
          <u-cell title="请求重试" isLink @click="handleRetry" />
          <u-cell title="不携带 Token" isLink @click="handleNoAuth" />
        </u-cell-group>
      </view>

      <view v-if="responseData" class="card">
        <text class="card-title">响应结果</text>
        <scroll-view scroll-y class="response-box">
          <text class="response-text">{{ responseData }}</text>
        </scroll-view>
      </view>

      <view class="card">
        <text class="card-title">使用方式</text>
        <view class="code-block">
          <text class="code-text">// 方式一：直接使用 http 工具
import http from '@/utils/request.js'

const res = await http.get('/api/list', { page: 1 })
const res = await http.post('/api/create', { name: 'test' })

// 方式二：通过 API 模块调用
import { getUserInfoApi } from '@/api'

const userInfo = await getUserInfoApi()

// 方式三：带配置项
const res = await http.get('/api/data', null, {
  loading: true,
  silent: true,
  noRepeat: true,
  noAuth: true,
  retryCount: 2,
  timeout: 10000
})</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import http from '@/utils/request.js'

const getLoading = ref(false)
const postLoading = ref(false)
const responseData = ref('')

function showResponse(data) {
  responseData.value = JSON.stringify(data, null, 2)
}

async function handleGet() {
  getLoading.value = true
  try {
    const res = await http.get('/api/demo/list', { page: 1, size: 10 })
    showResponse(res)
  } catch (error) {
    showResponse({ error: error.message, code: error.code })
  } finally {
    getLoading.value = false
  }
}

async function handlePost() {
  postLoading.value = true
  try {
    const res = await http.post('/api/demo/create', {
      name: '测试数据',
      type: 'demo'
    })
    showResponse(res)
  } catch (error) {
    showResponse({ error: error.message, code: error.code })
  } finally {
    postLoading.value = false
  }
}

async function handlePut() {
  try {
    const res = await http.put('/api/demo/update/1', { name: '更新数据' })
    showResponse(res)
  } catch (error) {
    showResponse({ error: error.message, code: error.code })
  }
}

async function handleDelete() {
  try {
    const res = await http.delete('/api/demo/delete/1')
    showResponse(res)
  } catch (error) {
    showResponse({ error: error.message, code: error.code })
  }
}

async function handleWithLoading() {
  try {
    const res = await http.get('/api/demo/list', null, {
      loading: true,
      loadingText: '正在加载...'
    })
    showResponse(res)
  } catch (error) {
    showResponse({ error: error.message })
  }
}

async function handleSilent() {
  try {
    const res = await http.get('/api/demo/error', null, { silent: true })
    showResponse(res)
  } catch (error) {
    showResponse({ info: '静默模式：错误不会弹出提示', error: error.message })
  }
}

async function handleNoRepeat() {
  try {
    http.get('/api/demo/list', null, { noRepeat: true })
    const res = await http.get('/api/demo/list', null, { noRepeat: true })
    showResponse(res)
  } catch (error) {
    showResponse({ info: '防重复：短时间内相同请求会被拦截', error: error.message })
  }
}

async function handleTimeout() {
  try {
    const res = await http.get('/api/demo/slow', null, { timeout: 5000 })
    showResponse(res)
  } catch (error) {
    showResponse({ info: '自定义超时：5 秒', error: error.message })
  }
}

async function handleRetry() {
  try {
    const res = await http.get('/api/demo/unstable', null, { retryCount: 2 })
    showResponse(res)
  } catch (error) {
    showResponse({ info: '请求重试：最多重试 2 次', error: error.message })
  }
}

async function handleNoAuth() {
  try {
    const res = await http.get('/api/demo/public', null, { noAuth: true })
    showResponse(res)
  } catch (error) {
    showResponse({ info: '无需 Token 的公开接口', error: error.message })
  }
}
</script>

<style lang="scss" scoped>
.card-desc {
  font-size: 24rpx;
  color: $text-secondary;
  margin-bottom: 24rpx;
  display: block;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 16rpx;
  display: block;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.response-box {
  max-height: 400rpx;
  background-color: $bg-gray;
  border-radius: $radius-base;
  padding: 20rpx;
}

.response-text {
  font-size: 22rpx;
  color: $text-regular;
  font-family: monospace;
  word-break: break-all;
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
