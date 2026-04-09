<template>
  <view class="search-bar">
    <view class="search-input-wrapper">
      <u-icon name="search" size="18" color="#999"></u-icon>
      <input
        class="search-input"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :maxlength="maxlength"
        :disabled="disabled"
        :focus="focus"
        confirm-type="search"
        @input="handleInput"
        @confirm="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <view class="search-clear" v-if="showClear && modelValue" @click="handleClear">
        <u-icon name="close-circle-fill" size="16" color="#ccc"></u-icon>
      </view>
    </view>
    <view class="search-action" v-if="showAction">
      <text class="action-text" @click="handleAction">{{ actionText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词'
    },
    placeholderStyle: {
      type: String,
      default: 'color: #999'
    },
    maxlength: {
      type: Number,
      default: 50
    },
    disabled: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    showClear: {
      type: Boolean,
      default: true
    },
    showAction: {
      type: Boolean,
      default: false
    },
    actionText: {
      type: String,
      default: '搜索'
    }
  },
  emits: ['update:modelValue', 'search', 'clear', 'focus', 'blur', 'action'],
  methods: {
    handleInput(e) {
      const value = e.detail.value
      this.$emit('update:modelValue', value)
    },

    handleSearch() {
      this.$emit('search', this.modelValue)
    },

    handleClear() {
      this.$emit('update:modelValue', '')
      this.$emit('clear')
    },

    handleFocus(e) {
      this.$emit('focus', e)
    },

    handleBlur(e) {
      this.$emit('blur', e)
    },

    handleAction() {
      if (this.modelValue) {
        this.handleSearch()
      }
      this.$emit('action', this.modelValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  background: #fff;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 32rpx;
  padding: 0 24rpx;
  height: 64rpx;
}

.search-input {
  flex: 1;
  margin-left: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.search-clear {
  padding: 8rpx;
}

.search-action {
  margin-left: 24rpx;
}

.action-text {
  font-size: 28rpx;
  color: #1890ff;
}
</style>
