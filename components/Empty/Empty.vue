<template>
  <view class="empty-container">
    <view class="empty-content">
      <image
        v-if="image"
        class="empty-image"
        :src="image"
        mode="aspectFit"
      ></image>
      <view v-else class="empty-icon">
        <u-icon :name="icon" :size="iconSize" :color="iconColor"></u-icon>
      </view>
      <text class="empty-text">{{ text }}</text>
      <text class="empty-desc" v-if="description">{{ description }}</text>
      <view class="empty-action" v-if="showAction">
        <u-button
          :type="actionType"
          :size="actionSize"
          @click="handleAction"
        >
          {{ actionText }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Empty',
  props: {
    image: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'inbox'
    },
    iconSize: {
      type: [String, Number],
      default: 80
    },
    iconColor: {
      type: String,
      default: '#ccc'
    },
    text: {
      type: String,
      default: '暂无数据'
    },
    description: {
      type: String,
      default: ''
    },
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: '重新加载'
    },
    actionType: {
      type: String,
      default: 'primary'
    },
    actionSize: {
      type: String,
      default: 'normal'
    }
  },
  emits: ['action'],
  methods: {
    handleAction() {
      this.$emit('action')
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400rpx;
  padding: 60rpx 40rpx;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
}

.empty-icon {
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-top: 20rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #999;
  margin-top: 12rpx;
  text-align: center;
}

.empty-action {
  margin-top: 40rpx;
}
</style>
