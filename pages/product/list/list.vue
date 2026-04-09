<template>
  <view class="agent-page">
    <!-- 顶部状态Tab栏 -->
    <view class="status-tabs">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="status-tab-item"
        :class="{ active: currentStatus === tab.value }"
        @click="switchStatus(tab.value)"
      >
        <text>{{ tab.label }}</text>
        <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
      </view>
    </view>

    <!-- 搜索与操作栏 -->
    <view class="search-action-bar">
      <view class="search-wrapper">
        <u-search
          v-model="searchKeyword"
          placeholder="搜索产品名称"
          :showAction="false"
          bgColor="#F5F5F5"
          @search="handleSearch"
          @clear="handleClear"
        />
      </view>
      <u-button
        type="primary"
        size="small"
        icon="plus"
        text="新增产品"
        @click="addProduct"
        :customStyle="{ borderRadius: '8rpx' }"
      />
    </view>

    <!-- 产品列表 -->
    <z-paging
      ref="pagingRef"
      v-model="productList"
      @query="queryList"
    >
      <view class="product-list">
        <view 
          class="product-card" 
          v-for="item in productList" 
          :key="item.id"
          @click="viewProduct(item)"
        >
          <!-- 产品基本信息 -->
          <view class="card-content">
            <u-image 
              :src="item.coverUrl" 
              width="200rpx" 
              height="150rpx" 
              radius="8"
              mode="aspectFill"
            />
            <view class="product-info">
              <view class="product-header">
                <text class="product-title">{{ item.title }}</text>
                <view class="product-status" :class="getStatusClass(item.status)">
                  {{ getStatusText(item.status) }}
                </view>
              </view>
              <view class="product-tags">
                <u-tag 
                  :text="item.categoryName" 
                  type="primary" 
                  plain 
                  size="mini" 
                />
              </view>
              <view class="product-price">
                <text class="price-label">参考价:</text>
                <text class="price-value">¥{{ item.priceMin }}-{{ item.priceMax }}</text>
              </view>
            </view>
          </view>

          <!-- 卡片底部操作栏 -->
          <view class="card-actions">
            <view class="action-left">
              <text class="action-info">创建时间: {{ item.createdAt }}</text>
            </view>
            <view class="action-right">
              <u-button 
                size="mini" 
                text="编辑"
                :customStyle="{ marginRight: '16rpx' }"
                @click.stop="editProduct(item)"
              />
              <view class="switch-wrapper" @click.stop>
                <text class="switch-label">{{ item.status === 'online' ? '已上架' : '已下架' }}</text>
                <u-switch
                  v-model="item.isOnline"
                  size="20"
                  activeColor="#1890FF"
                  @change="(val) => toggleOnline(item, val)"
                />
              </view>
              <u-button 
                v-if="item.status === 'offline' || item.status === 'rejected'"
                size="mini" 
                type="error"
                text="删除"
                :customStyle="{ marginLeft: '16rpx' }"
                @click.stop="deleteProduct(item)"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <template #empty>
        <view class="empty-container">
          <u-empty mode="data" text="暂无产品数据" />
          <u-button 
            type="primary" 
            size="small" 
            text="去发布产品"
            :customStyle="{ marginTop: '32rpx' }"
            @click="addProduct"
          />
        </view>
      </template>
    </z-paging>

    <!-- 删除确认弹窗 -->
    <u-modal
      :show="showDeleteModal"
      title="确认删除"
      content="确定要删除该产品吗？删除后不可恢复。"
      showCancelButton
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 分页引用
const pagingRef = ref(null)

// 状态Tab
const statusTabs = ref([
  { label: '全部', value: 'all', count: 0 },
  { label: '已上架', value: 'online', count: 0 },
  { label: '已下架', value: 'offline', count: 0 },
  { label: '审核中', value: 'pending', count: 0 },
  { label: '已驳回', value: 'rejected', count: 0 }
])
const currentStatus = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 产品列表
const productList = ref([])

// 删除弹窗
const showDeleteModal = ref(false)
const deleteTarget = ref(null)

// 模拟产品数据
const mockProducts = [
  {
    id: 1,
    title: '百里家乡-龙坪天池亲子游',
    coverUrl: 'https://cdn.uviewui.com/uview/album/1.jpg',
    categoryId: 1,
    categoryName: '百里家乡',
    status: 'online',
    isOnline: true,
    priceMin: 298,
    priceMax: 398,
    createdAt: '2026-04-01',
    viewCount: 1256,
    enrollCount: 89
  },
  {
    id: 2,
    title: '周末农场亲子体验活动',
    coverUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
    categoryId: 1,
    categoryName: '百里家乡',
    status: 'online',
    isOnline: true,
    priceMin: 198,
    priceMax: 268,
    createdAt: '2026-03-28',
    viewCount: 856,
    enrollCount: 56
  },
  {
    id: 3,
    title: '春季亲子露营活动',
    coverUrl: 'https://cdn.uviewui.com/uview/album/3.jpg',
    categoryId: 2,
    categoryName: '万里中国',
    status: 'pending',
    isOnline: false,
    priceMin: 358,
    priceMax: 458,
    createdAt: '2026-04-05',
    viewCount: 0,
    enrollCount: 0
  },
  {
    id: 4,
    title: '儿童手工艺术体验课',
    coverUrl: 'https://cdn.uviewui.com/uview/album/4.jpg',
    categoryId: 3,
    categoryName: '社区互助',
    status: 'offline',
    isOnline: false,
    priceMin: 128,
    priceMax: 168,
    createdAt: '2026-03-15',
    viewCount: 456,
    enrollCount: 23
  },
  {
    id: 5,
    title: '亲子科学实验探索营',
    coverUrl: 'https://cdn.uviewui.com/uview/album/5.jpg',
    categoryId: 2,
    categoryName: '万里中国',
    status: 'rejected',
    isOnline: false,
    priceMin: 268,
    priceMax: 368,
    createdAt: '2026-04-02',
    viewCount: 0,
    enrollCount: 0
  }
]

// 页面加载
onLoad((options) => {
  if (options?.status) {
    currentStatus.value = options.status
  }
})

// 页面显示时刷新
onShow(() => {
  updateTabCounts()
})

// 更新Tab计数
function updateTabCounts() {
  const counts = {
    all: mockProducts.length,
    online: mockProducts.filter(p => p.status === 'online').length,
    offline: mockProducts.filter(p => p.status === 'offline').length,
    pending: mockProducts.filter(p => p.status === 'pending').length,
    rejected: mockProducts.filter(p => p.status === 'rejected').length
  }
  statusTabs.value.forEach(tab => {
    tab.count = counts[tab.value] || 0
  })
}

// 查询列表
function queryList(pageNo, pageSize) {
  // 模拟请求延迟
  setTimeout(() => {
    let list = [...mockProducts]
    
    // 状态筛选
    if (currentStatus.value !== 'all') {
      list = list.filter(item => item.status === currentStatus.value)
    }
    
    // 关键词搜索
    if (searchKeyword.value) {
      list = list.filter(item => 
        item.title.includes(searchKeyword.value)
      )
    }
    
    // 分页
    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const pageList = list.slice(start, end)
    
    pagingRef.value?.complete(pageList)
  }, 500)
}

// 切换状态Tab
function switchStatus(status) {
  currentStatus.value = status
  pagingRef.value?.reload()
}

// 搜索
function handleSearch() {
  pagingRef.value?.reload()
}

// 清空搜索
function handleClear() {
  searchKeyword.value = ''
  pagingRef.value?.reload()
}

// 获取状态样式类
function getStatusClass(status) {
  const classMap = {
    online: 'status-online',
    offline: 'status-offline',
    pending: 'status-pending',
    rejected: 'status-rejected'
  }
  return classMap[status] || ''
}

// 获取状态文本
function getStatusText(status) {
  const textMap = {
    online: '已上架',
    offline: '已下架',
    pending: '审核中',
    rejected: '已驳回'
  }
  return textMap[status] || ''
}

// 新增产品
function addProduct() {
  uni.navigateTo({ url: '/pages/product/edit/edit' })
}

// 查看产品
function viewProduct(item) {
  uni.navigateTo({ url: `/pages/product/detail/detail?id=${item.id}` })
}

// 编辑产品
function editProduct(item) {
  uni.navigateTo({ url: `/pages/product/edit/edit?id=${item.id}` })
}

// 切换上下架
function toggleOnline(item, val) {
  const action = val ? '上架' : '下架'
  uni.showModal({
    title: '确认操作',
    content: `确定要${action}该产品吗？`,
    success: (res) => {
      if (res.confirm) {
        // 模拟操作
        item.status = val ? 'online' : 'offline'
        uni.showToast({ title: `${action}成功`, icon: 'success' })
        updateTabCounts()
      } else {
        // 取消操作，恢复状态
        item.isOnline = !val
      }
    }
  })
}

// 删除产品
function deleteProduct(item) {
  deleteTarget.value = item
  showDeleteModal.value = true
}

// 确认删除
function confirmDelete() {
  if (deleteTarget.value) {
    const index = mockProducts.findIndex(p => p.id === deleteTarget.value.id)
    if (index > -1) {
      mockProducts.splice(index, 1)
    }
    uni.showToast({ title: '删除成功', icon: 'success' })
    updateTabCounts()
    pagingRef.value?.reload()
  }
  showDeleteModal.value = false
  deleteTarget.value = null
}
</script>

<style lang="scss" scoped>
.agent-page {
  min-height: 100vh;
  background-color: #F0F2F5;
}

// 状态Tab栏
.status-tabs {
  display: flex;
  background-color: #FFFFFF;
  padding: 0 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
  overflow-x: auto;
  white-space: nowrap;

  .status-tab-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 24rpx 20rpx;
    font-size: 28rpx;
    color: #595959;
    flex-shrink: 0;

    &.active {
      color: #1890FF;
      font-weight: 500;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background-color: #1890FF;
        border-radius: 2rpx;
      }
    }

    .tab-badge {
      min-width: 32rpx;
      height: 32rpx;
      padding: 0 8rpx;
      margin-left: 8rpx;
      background-color: #F5F5F5;
      border-radius: 16rpx;
      font-size: 20rpx;
      color: #8C8C8C;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.active .tab-badge {
      background-color: rgba(24, 144, 255, 0.1);
      color: #1890FF;
    }
  }
}

// 搜索操作栏
.search-action-bar {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #FFFFFF;

  .search-wrapper {
    flex: 1;
    margin-right: 24rpx;
  }
}

// 产品列表
.product-list {
  padding: 24rpx;
}

.product-card {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .card-content {
    display: flex;
    padding: 24rpx;
  }

  .product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12rpx;

      .product-title {
        flex: 1;
        font-size: 30rpx;
        font-weight: 500;
        color: #262626;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-right: 16rpx;
      }

      .product-status {
        flex-shrink: 0;
        padding: 4rpx 16rpx;
        border-radius: 8rpx;
        font-size: 22rpx;

        &.status-online {
          background-color: #f6ffed;
          color: #52C41A;
        }

        &.status-offline {
          background-color: #fff1f0;
          color: #F5222D;
        }

        &.status-pending {
          background-color: #fffbe6;
          color: #FAAD14;
        }

        &.status-rejected {
          background-color: #fff1f0;
          color: #F5222D;
        }
      }
    }

    .product-tags {
      margin-bottom: 12rpx;
    }

    .product-price {
      margin-top: auto;

      .price-label {
        font-size: 24rpx;
        color: #8C8C8C;
      }

      .price-value {
        font-size: 28rpx;
        color: #F5222D;
        font-weight: 500;
        margin-left: 8rpx;
      }
    }
  }

  .card-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 24rpx;
    border-top: 1rpx solid #F0F0F0;
    background-color: #FAFAFA;

    .action-left {
      .action-info {
        font-size: 22rpx;
        color: #8C8C8C;
      }
    }

    .action-right {
      display: flex;
      align-items: center;

      .switch-wrapper {
        display: flex;
        align-items: center;

        .switch-label {
          font-size: 22rpx;
          color: #8C8C8C;
          margin-right: 12rpx;
        }
      }
    }
  }
}

// 空状态
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 24rpx;
}
</style>
