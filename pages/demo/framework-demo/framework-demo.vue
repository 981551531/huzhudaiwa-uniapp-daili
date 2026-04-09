<template>
  <view class="page-container">
    <view class="page-content">
      <view class="card">
        <text class="card-title">框架能力示例</text>
        <text class="card-desc">演示路由、缓存、Hooks、状态管理、弹窗和校验等能力。</text>
      </view>

      <view class="card">
        <text class="card-title">缓存</text>
        <view class="info-row">
          <text class="info-label">当前值</text>
          <text class="info-value">{{ cacheValue || '-' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="写入缓存" @click="handleWriteCache" />
          <u-button type="warning" size="small" text="读取缓存" @click="handleReadCache" />
          <u-button type="error" size="small" text="清空缓存" @click="handleClearCache" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">useRequest</text>
        <view class="info-row">
          <text class="info-label">加载中</text>
          <text class="info-value">{{ detailLoading ? '是' : '否' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">结果</text>
          <text class="info-value">{{ detailData ? detailData.title : '-' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="发起请求" :loading="detailLoading" @click="fetchDetail" />
          <u-button type="success" size="small" text="刷新" :loading="detailLoading" @click="refreshDetail" />
          <u-button type="info" size="small" text="重置" @click="resetDetail" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">useSubmit</text>
        <view class="info-row">
          <text class="info-label">提交中</text>
          <text class="info-value">{{ submitting ? '是' : '否' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="提交示例" :loading="submitting" @click="handleSubmit" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">usePaging</text>
        <view class="info-row">
          <text class="info-label">总数</text>
          <text class="info-value">{{ total }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">状态</text>
          <text class="info-value">{{ pagingLoading ? '加载中' : finished ? '已结束' : '空闲' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">错误</text>
          <text class="info-value">{{ pagingErrorMessage || '-' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="刷新列表" :loading="refreshing" @click="refreshList" />
          <u-button type="success" size="small" text="加载更多" :loading="loadingMore" @click="loadMoreList" />
          <u-button type="warning" size="small" text="重试" @click="retryList" />
        </view>
        <view class="demo-list">
          <view v-for="item in list" :key="item.id" class="demo-item">
            <text class="demo-item-title">{{ item.title }}</text>
            <text class="demo-item-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="card-title">状态管理</text>
        <view class="info-row">
          <text class="info-label">当前城市</text>
          <text class="info-value">{{ configStore.currentCity || '-' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">字典标签</text>
          <text class="info-value">{{ dictLabel || '-' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="设置配置" @click="handleSetConfig" />
          <u-button type="warning" size="small" text="写入字典" @click="handleSeedDict" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">平台 / 设备</text>
        <view class="info-row">
          <text class="info-label">平台</text>
          <text class="info-value">{{ platformLabel }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">窗口</text>
          <text class="info-value">{{ windowSize.width }} x {{ windowSize.height }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">导航栏</text>
          <text class="info-value">{{ navbarHeight }}</text>
        </view>
      </view>

      <view class="card">
        <text class="card-title">弹窗</text>
        <view class="info-row">
          <text class="info-label">最后结果</text>
          <text class="info-value">{{ modalResult || '-' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="提示框" @click="handleAlert" />
          <u-button type="warning" size="small" text="确认框" @click="handleConfirm" />
          <u-button type="success" size="small" text="操作菜单" @click="handleActionSheet" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">校验器</text>
        <view class="info-row">
          <text class="info-label">结果</text>
          <text class="info-value">{{ validatorResult }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="执行校验" @click="handleValidate" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">useForm</text>
        <view class="info-row">
          <text class="info-label">名称错误</text>
          <text class="info-value">{{ formErrors.name || '-' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">价格错误</text>
          <text class="info-value">{{ formErrors.price || '-' }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="校验表单" @click="handleValidateForm" />
          <u-button type="info" size="small" text="重置表单" @click="handleResetForm" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">路由</text>
        <view class="code-block">
          <text class="code-text">{{ routerExample }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useForm, usePaging, useRequest, useSubmit } from '@/hooks'
import { useConfigStore, useDictStore } from '@/store'
import {
  clearCache,
  getCache,
  getNavbarHeight,
  getPlatformLabel,
  getWindowSize,
  isPositiveNumber,
  isRequired,
  setCache,
  showActionSheet,
  showAlert,
  showConfirm,
  validateForm,
  createRule
} from '@/utils'

const cacheValue = ref('')
const modalResult = ref('')
const validatorResult = ref('')
const configStore = useConfigStore()
const dictStore = useDictStore()
const platformLabel = getPlatformLabel()
const windowSize = getWindowSize()
const navbarHeight = getNavbarHeight()
const {
  errors: formErrors,
  validate: validateDemoForm,
  reset: resetDemoForm
} = useForm({
  name: '',
  price: ''
}, {
  name: [
    createRule(isRequired, '名称不能为空')
  ],
  price: [
    createRule(isRequired, '价格不能为空'),
    createRule(isPositiveNumber, '价格格式不正确')
  ]
})

function wait(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function mockFetchDetail() {
  await wait()
  return {
    id: 1,
    title: '框架详情已加载',
    updatedAt: Date.now()
  }
}

async function mockSubmitApi() {
  await wait()
  return {
    success: true
  }
}

async function mockFetchList(params) {
  await wait()
  const { pageNum = 1, pageSize = 10 } = params
  const total = 23
  const start = (pageNum - 1) * pageSize
  const records = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, index) => {
    const id = start + index + 1
    return {
      id,
      title: `示例项 ${id}`,
      desc: `由 usePaging 加载，当前页码：${pageNum}`
    }
  })

  return {
    list: records,
    total
  }
}

const {
  loading: detailLoading,
  data: detailData,
  runAsync: fetchDetail,
  refresh: refreshDetail,
  reset: resetDetail
} = useRequest(mockFetchDetail, {
  defaultValue: null
})

const {
  submitting,
  submitAsync
} = useSubmit(mockSubmitApi, {
  successText: '提交成功'
})

const {
  list,
  total,
  loading: pagingLoading,
  refreshing,
  loadingMore,
  finished,
  errorMessage: pagingErrorMessage,
  refresh: refreshList,
  loadMore: loadMoreList,
  retry: retryList
} = usePaging(mockFetchList, {
  immediate: true,
  initialPageSize: 5,
  emptyText: '暂无数据',
  showError: false
})

const dictLabel = computed(() => dictStore.getDictLabel('status', 1))

const routerExample = `import { go, back, toLogin, withLogin } from '@/utils'

go('/pages/demo/framework-demo/framework-demo', { source: 'index' })
back(1, { refresh: true })
toLogin()
withLogin(() => go('/pages/order/list'))`

function handleWriteCache() {
  const value = `cached_${Date.now()}`
  setCache('framework_demo', value, 60 * 1000)
  cacheValue.value = value
}

function handleReadCache() {
  cacheValue.value = getCache('framework_demo', '')
}

function handleClearCache() {
  clearCache('framework_demo')
  cacheValue.value = ''
}

async function handleSubmit() {
  await submitAsync()
}

function handleSetConfig() {
  configStore.initConfig({
    currentCity: '上海',
    remoteConfig: {
      enableFrameworkDemo: true
    }
  })
}

function handleSeedDict() {
  dictStore.setDict('status', [
    { label: '禁用', value: 0 },
    { label: '启用', value: 1 }
  ])
}

async function handleAlert() {
  await showAlert('这是一个提示弹窗')
  modalResult.value = '提示框已关闭'
}

async function handleConfirm() {
  const confirmed = await showConfirm({
    title: '确认',
    content: '是否继续本次操作？'
  })
  modalResult.value = confirmed ? '确认结果：是' : '确认结果：否'
}

async function handleActionSheet() {
  try {
    const tapIndex = await showActionSheet({
      itemList: ['编辑', '删除']
    })
    modalResult.value = `操作序号：${tapIndex}`
  } catch (error) {
    modalResult.value = '已取消操作'
  }
}

function handleValidate() {
  const result = validateForm({
    name: 'Demo',
    price: '18.8'
  }, {
    name: [
      createRule(isRequired, '名称不能为空')
    ],
    price: [
      createRule(isRequired, '价格不能为空'),
      createRule(isPositiveNumber, '价格格式不正确')
    ]
  })

  validatorResult.value = result.valid ? '校验通过' : JSON.stringify(result.errors)
}

async function handleValidateForm() {
  const result = await validateDemoForm()
  validatorResult.value = result.valid ? '表单校验通过' : '表单校验未通过'
}

function handleResetForm() {
  resetDemoForm()
  validatorResult.value = '表单已重置'
}
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 16rpx;
  display: block;
}

.card-desc {
  font-size: 24rpx;
  color: $text-secondary;
  display: block;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
}

.info-label {
  width: 180rpx;
  flex-shrink: 0;
  font-size: 24rpx;
  color: $text-secondary;
}

.info-value {
  flex: 1;
  font-size: 24rpx;
  color: $text-primary;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
}

.demo-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.demo-item {
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: $bg-gray;
}

.demo-item-title {
  display: block;
  font-size: 26rpx;
  color: $text-primary;
}

.demo-item-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $text-secondary;
}

.code-block {
  background-color: #1e1e1e;
  border-radius: $radius-base;
  padding: 24rpx;
}

.code-text {
  font-size: 22rpx;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
