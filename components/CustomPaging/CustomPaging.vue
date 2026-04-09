<template>
  <view
    class="custom-paging-container"
    :class="{ 'custom-paging-fixed': fixed }"
    :style="{ background: bgColor }"
  >
    <scroll-view
      class="custom-paging-scroll"
      :scroll-y="true"
      :scroll-top="scrollTop"
      @scroll="onScroll"
      :style="{ height: scrollHeight }"
      :lower-threshold="lowerThreshold"
      :refresher-enabled="refresherEnabled"
      :refresher-triggered="refresherTriggered"
      :refresher-threshold="refresherThreshold"
      :refresher-background="bgColor"
      refresher-default-style="none"
      @refresherpulling="onRefresherPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @scrolltolower="onScrollToLower"
    >
      <view class="custom-paging-content">
        <slot></slot>
      </view>

      <view class="custom-paging-loadmore" v-if="total > 0 || modelValue.length > 0">
        <slot name="loadingMore" :status="loadingMoreStatus">
          <view class="loadmore-default">
            <view v-if="loadingMoreStatus === 'loading'" class="loadmore-loading">
              <view class="loading-icon"></view>
              <text class="loading-text">加载中...</text>
            </view>
            <text v-else-if="loadingMoreStatus === 'nomore'" class="loadmore-text">
              {{ loadmoreText }}
            </text>
            <text v-else-if="loadingMoreStatus === 'error'" class="loadmore-error" @click="onScrollToLower">
              加载失败，点击重试
            </text>
          </view>
        </slot>
      </view>

      <view class="custom-paging-empty" v-if="showEmpty">
        <slot name="empty">
          <view class="empty-default">
            <image class="empty-image" src="/static/images/empty.png" mode="aspectFit"></image>
            <text class="empty-text">{{ emptyText }}</text>
          </view>
        </slot>
      </view>
    </scroll-view>

    <view class="custom-paging-refresh" v-if="showRefresh">
      <slot name="refresh" :status="refreshStatus">
        <view class="refresh-default">
          <view v-if="refreshStatus === 'pulling'" class="refresh-pulling">
            <text>下拉刷新</text>
          </view>
          <view v-else-if="refreshStatus === 'loosing'" class="refresh-loosing">
            <text>释放刷新</text>
          </view>
          <view v-else-if="refreshStatus === 'loading'" class="refresh-loading">
            <view class="loading-icon"></view>
            <text>刷新中...</text>
          </view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomPaging',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageNum: {
      type: Number,
      default: 1
    },
    fixed: {
      type: Boolean,
      default: false
    },
    bgColor: {
      type: String,
      default: '#f5f5f5'
    },
    scrollHeight: {
      type: String,
      default: '100vh'
    },
    lowerThreshold: {
      type: Number,
      default: 50
    },
    refresherEnabled: {
      type: Boolean,
      default: true
    },
    refresherThreshold: {
      type: Number,
      default: 80
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    loadmoreText: {
      type: String,
      default: '没有更多了'
    },
    showEmpty: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'update:pageNum', 'refresh', 'loadmore', 'scroll'],
  data() {
    return {
      scrollTop: 0,
      refresherTriggered: false,
      refreshStatus: '',
      loadingMoreStatus: '',
      isLoading: false,
      current: 1
    }
  },
  computed: {
    hasMore() {
      return this.modelValue.length < this.total
    }
  },
  watch: {
    pageNum: {
      immediate: true,
      handler(val) {
        this.current = val
      }
    }
  },
  methods: {
    onScroll(e) {
      this.$emit('scroll', e)
    },

    onRefresherPulling(e) {
      const { deltaY } = e.detail
      if (deltaY < this.refresherThreshold) {
        this.refreshStatus = 'pulling'
      } else {
        this.refreshStatus = 'loosing'
      }
    },

    async onRefresh() {
      if (this.isLoading) return

      this.isLoading = true
      this.refreshStatus = 'loading'
      this.refresherTriggered = true

      try {
        await this.$emit('refresh')
        this.current = 1
        this.loadingMoreStatus = ''
      } catch (error) {
        console.error('刷新失败:', error)
      } finally {
        this.isLoading = false
        this.refreshStatus = ''
        this.refresherTriggered = false
      }
    },

    onRestore() {
      this.refreshStatus = ''
    },

    async onScrollToLower() {
      if (this.isLoading || !this.hasMore) {
        if (!this.hasMore) {
          this.loadingMoreStatus = 'nomore'
        }
        return
      }

      this.isLoading = true
      this.loadingMoreStatus = 'loading'

      try {
        this.current++
        this.$emit('update:pageNum', this.current)
        await this.$emit('loadmore', this.current)
        this.loadingMoreStatus = this.hasMore ? '' : 'nomore'
      } catch (error) {
        console.error('加载更多失败:', error)
        this.loadingMoreStatus = 'error'
        this.current--
      } finally {
        this.isLoading = false
      }
    },

    scrollToTop() {
      this.scrollTop = 0
    },

    complete(data) {
      this.$emit('update:modelValue', data)
    },

    addData(data) {
      this.$emit('update:modelValue', [...this.modelValue, ...data])
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-paging-container {
  position: relative;
  width: 100%;
  height: 100%;

  &.custom-paging-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.custom-paging-scroll {
  width: 100%;
}

.custom-paging-content {
  min-height: 100%;
}

.custom-paging-loadmore {
  padding: 20rpx 0;
}

.loadmore-default {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80rpx;
}

.loadmore-loading {
  display: flex;
  align-items: center;
}

.loading-icon {
  width: 32rpx;
  height: 32rpx;
  border: 3rpx solid #ddd;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 16rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text,
.loadmore-text {
  font-size: 28rpx;
  color: #999;
}

.loadmore-error {
  font-size: 28rpx;
  color: #1890ff;
}

.custom-paging-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-default {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
}

.empty-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #999;
}

.custom-paging-refresh {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
}

.refresh-default {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80rpx;
  font-size: 28rpx;
  color: #999;
}

.refresh-loading {
  display: flex;
  align-items: center;
}
</style>
