<template>
  <view class="page-container">
    <view class="page-content">
      <view class="card">
        <text class="card-title">增删改查示例</text>
        <text class="card-desc">演示新增、查询、修改、删除的基础流程。</text>
      </view>

      <view class="card">
        <text class="card-title">新增 / 编辑表单</text>
        <view class="form-item">
          <text class="form-label">名称</text>
          <input v-model="formData.name" class="form-input" placeholder="请输入商品名称" />
        </view>
        <view class="form-item">
          <text class="form-label">价格</text>
          <input v-model="formData.price" class="form-input" type="number" placeholder="请输入价格" />
        </view>
        <view class="form-item">
          <text class="form-label">状态</text>
          <switch :checked="formData.status === 1" @change="handleStatusChange" />
        </view>
        <view class="btn-group">
          <u-button
            type="primary"
            size="small"
            :text="editingId ? '更新商品' : '新增商品'"
            :loading="submitting"
            @click="handleSubmit"
          />
          <u-button type="info" size="small" text="重置表单" @click="resetForm" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">列表查询</text>
        <view class="btn-group">
          <u-button type="primary" size="small" text="刷新" :loading="refreshing" @click="refreshList" />
          <u-button type="success" size="small" text="加载更多" :loading="loadingMore" @click="loadMoreList" />
        </view>
        <view class="demo-list">
          <view v-for="item in list" :key="item.id" class="demo-item">
            <view class="demo-item-main">
              <text class="demo-item-title">{{ item.name }}</text>
              <text class="demo-item-desc">价格：{{ item.price }} | 状态：{{ item.status === 1 ? '启用' : '禁用' }}</text>
            </view>
            <view class="demo-item-actions">
              <u-button type="warning" size="mini" text="编辑" @click="handleEdit(item)" />
              <u-button type="error" size="mini" text="删除" @click="handleDelete(item.id)" />
            </view>
          </view>
        </view>
      </view>

      <view class="card">
        <text class="card-title">详情查询</text>
        <view class="info-row">
          <text class="info-label">加载中</text>
          <text class="info-value">{{ detailLoading ? '是' : '否' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">详情</text>
          <text class="info-value">{{ detailSummary }}</text>
        </view>
        <view class="btn-group">
          <u-button type="primary" size="small" text="加载首条详情" :loading="detailLoading" @click="handleLoadFirstDetail" />
        </view>
      </view>

      <view class="card">
        <text class="card-title">守卫 / 事件</text>
        <view class="info-row">
          <text class="info-label">操作日志</text>
          <text class="info-value">{{ actionLog }}</text>
        </view>
      </view>

      <view class="card">
        <text class="card-title">代码示例</text>
        <view class="code-block">
          <text class="code-text">{{ crudExample }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useLoginGuard, usePaging, useRequest, useSubmit } from '@/hooks'
import { emit, on } from '@/utils'

const sourceList = ref([
  { id: 1, name: '苹果', price: '12.00', status: 1 },
  { id: 2, name: '橙子', price: '20.00', status: 0 },
  { id: 3, name: '香蕉', price: '8.50', status: 1 },
  { id: 4, name: '雪梨', price: '9.90', status: 1 },
  { id: 5, name: '葡萄', price: '18.00', status: 0 },
  { id: 6, name: '桃子', price: '15.60', status: 1 }
])

const editingId = ref(0)
const actionLog = ref('就绪')
const formData = reactive({
  name: '',
  price: '',
  status: 1
})
const { runWithLogin } = useLoginGuard({
  onReject: () => {
    actionLog.value = '已被登录守卫拦截'
  }
})

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function mockGetList(params) {
  await wait()
  const { pageNum = 1, pageSize = 5 } = params
  const start = (pageNum - 1) * pageSize
  const list = sourceList.value.slice(start, start + pageSize)

  return {
    list,
    total: sourceList.value.length
  }
}

async function mockGetDetail(id) {
  await wait()
  return sourceList.value.find((item) => item.id === id) || null
}

async function mockCreateProduct(payload) {
  await wait()
  const nextItem = {
    ...payload,
    id: Date.now()
  }
  sourceList.value = [nextItem, ...sourceList.value]
  return nextItem
}

async function mockUpdateProduct(id, payload) {
  await wait()
  sourceList.value = sourceList.value.map((item) => {
    if (item.id !== id) {
      return item
    }

    return {
      ...item,
      ...payload
    }
  })

  return sourceList.value.find((item) => item.id === id)
}

async function mockDeleteProduct(id) {
  await wait()
  sourceList.value = sourceList.value.filter((item) => item.id !== id)
  return true
}

const {
  list,
  refreshing,
  loadingMore,
  refresh: refreshList,
  loadMore: loadMoreList
} = usePaging(mockGetList, {
  immediate: true,
  initialPageSize: 3
})

const {
  loading: detailLoading,
  data: detailData,
  runAsync: fetchDetail,
  reset: resetDetail
} = useRequest(mockGetDetail, {
  defaultValue: null
})

const { submitting, submitAsync } = useSubmit(async () => {
  const payload = {
    name: formData.name.trim(),
    price: String(formData.price).trim(),
    status: formData.status
  }

  if (editingId.value) {
    await mockUpdateProduct(editingId.value, payload)
  } else {
    await mockCreateProduct(payload)
  }

  await refreshList()
  resetForm()
}, {
  successText: '保存成功',
  validate: () => !!formData.name.trim() && !!String(formData.price).trim()
})

const detailSummary = computed(() => {
  if (!detailData.value) {
    return '-'
  }

  return `${detailData.value.name} / ${detailData.value.price}`
})

const stopProductChanged = on('product:changed', (payload) => {
  actionLog.value = `event: ${payload.type}`
})

const crudExample = `import { reactive } from 'vue'
import { useLoginGuard, usePaging, useRequest, useSubmit } from '@/hooks'
import { emit } from '@/utils'
import { productApi } from '@/api'

const formData = reactive({
  name: '',
  price: '',
  status: 1
})
const { runWithLogin } = useLoginGuard()

const { list, refresh, loadMore } = usePaging(
  (params) => productApi.getList(params),
  { immediate: true }
)

const { data: detail, runAsync: fetchDetail } = useRequest(
  (id) => productApi.getDetail(id)
)

const { submitting, submitAsync } = useSubmit(
  () => runWithLogin(() => productApi.create(formData)),
  {
    successText: 'Created',
    validate: () => !!formData.name && !!formData.price
  }
)

await fetchDetail(1)
await submitAsync()
emit('product:changed', { type: 'create' })
await refresh()
await runWithLogin(() => productApi.remove(1))`

function handleStatusChange(event) {
  formData.status = event.detail.value ? 1 : 0
}

function resetForm() {
  editingId.value = 0
  formData.name = ''
  formData.price = ''
  formData.status = 1
}

async function handleSubmit() {
  const actionType = editingId.value ? 'update' : 'create'
  await runWithLogin(async () => {
    await submitAsync()
    emit('product:changed', { type: actionType })
    actionLog.value = actionType === 'create' ? '已新增商品' : '已更新商品'
  })
}

function handleEdit(item) {
  editingId.value = item.id
  formData.name = item.name
  formData.price = item.price
  formData.status = item.status
}

async function handleDelete(id) {
  await runWithLogin(async () => {
    await mockDeleteProduct(id)
    emit('product:changed', { type: 'delete', id })
    if (editingId.value === id) {
      resetForm()
    }
    resetDetail()
    await refreshList()
    actionLog.value = `已删除商品 ${id}`
  })
}

async function handleLoadFirstDetail() {
  if (!list.value.length) {
    return
  }

  await fetchDetail(list.value[0].id)
  actionLog.value = `已加载商品 ${list.value[0].id} 的详情`
}

onBeforeUnmount(() => {
  stopProductChanged()
})
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

.form-item {
  margin-bottom: 20rpx;
}

.form-label {
  display: block;
  margin-bottom: 8rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.form-input {
  height: 76rpx;
  padding: 0 20rpx;
  border-radius: 12rpx;
  background-color: $bg-gray;
  font-size: 26rpx;
  color: $text-primary;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background-color: $bg-gray;
}

.demo-item-main {
  flex: 1;
}

.demo-item-actions {
  display: flex;
  gap: 12rpx;
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
