<template>
  <view class="loading-mask" v-if="visible" :class="{ 'loading-transparent': transparent }">
    <view class="loading-container">
      <view class="loading-spinner">
        <view class="spinner-item" v-for="i in 5" :key="i"></view>
      </view>
      <text class="loading-text" v-if="text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中...'
    },
    transparent: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);

  &.loading-transparent {
    background: transparent;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 60rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 16rpx;
}

.loading-spinner {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 40rpx;
  gap: 8rpx;
}

.spinner-item {
  width: 8rpx;
  height: 10rpx;
  background: #fff;
  border-radius: 4rpx;
  animation: loading 1.2s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.1s;
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
  }
  &:nth-child(5) {
    animation-delay: 0.4s;
  }
}

@keyframes loading {
  0% {
    height: 10rpx;
    background: #fff;
  }
  25% {
    height: 40rpx;
    background: #1890ff;
  }
  50% {
    height: 10rpx;
    background: #1890ff;
  }
  100% {
    height: 10rpx;
    background: #fff;
  }
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #fff;
}
</style>
