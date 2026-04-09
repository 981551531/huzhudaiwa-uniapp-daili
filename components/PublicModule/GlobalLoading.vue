<template>
  <view
    v-if="visible"
    class="global-loading-mask"
    :class="{ 'loading-show': visible, 'dark-mode': darkMode }"
    @touchmove.stop.prevent
  >
    <view class="loading-container">
      <view class="loading-spinner">
        <view v-for="i in 5" :key="i" class="spinner-item"></view>
      </view>
      <text v-if="text" class="loading-text">{{ text }}</text>
    </view>
  </view>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/store'

export default {
  name: 'GlobalLoading',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '加载中...'
    }
  },
  setup() {
    const appStore = useAppStore()
    const darkMode = computed(() => appStore.isDarkMode)

    return {
      darkMode
    }
  }
}
</script>

<style lang="scss" scoped>
.global-loading-mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0);

  &.dark-mode {
    background: rgba(0, 0, 0, 0.3);
  }
}

.loading-container {
  width: 220rpx;
  height: 170rpx;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 18rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 36px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 30px;
}

.spinner-item {
  display: block;
  position: relative;
  width: 4px;
  height: 5px;
  margin: 0 2px;
  background: coral;
  border-radius: 2px;
  animation: loader 1.5s infinite ease-in-out;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  &:nth-child(4) {
    animation-delay: 0.6s;
  }

  &:nth-child(5) {
    animation-delay: 0.8s;
  }
}

@keyframes loader {
  0% {
    height: 5px;
    transform: translateY(0px);
    background: coral;
  }

  25% {
    height: 30px;
    transform: translateY(0px);
    background: cornflowerblue;
  }

  50% {
    height: 5px;
    transform: translateY(0px);
    background: cornflowerblue;
  }

  100% {
    height: 5px;
    transform: translateY(0px);
    background: coral;
  }
}

.loading-text {
  color: #fff;
  font-size: 28rpx;
  margin-top: 20rpx;
}
</style>
