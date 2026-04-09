<template>
  <u-popup :show="visible" mode="bottom" :round="20" @close="handleClose">
    <view class="pay-popup">
      <view class="pay-header">
        <text class="pay-title">选择支付方式</text>
        <view class="close-btn" @click="handleClose">
          <u-icon name="close" size="20" color="#999"></u-icon>
        </view>
      </view>

      <view class="pay-content">
        <view class="pay-amount">
          <text class="amount-label">支付金额</text>
          <view class="amount-value">
            <text class="currency">¥</text>
            <text class="number">{{ formatAmount }}</text>
          </view>
        </view>

        <view class="pay-methods">
          <view
            class="pay-item"
            v-for="item in payMethods"
            :key="item.type"
            :class="{ disabled: item.disabled }"
            @click="handleSelectPayMethod(item)"
          >
            <view class="pay-left">
              <view class="pay-icon" :style="{ background: item.color }">
                <u-icon :name="item.icon" size="22" color="#fff"></u-icon>
              </view>
              <view class="pay-info">
                <text class="pay-name">{{ item.name }}</text>
                <text class="pay-desc" v-if="item.desc">{{ item.desc }}</text>
              </view>
            </view>
            <view class="pay-right">
              <text class="pay-balance" v-if="item.balance !== undefined">
                余额: ¥{{ item.balance }}
              </text>
              <view class="pay-check" :class="{ checked: selectedType === item.type }">
                <u-icon v-if="selectedType === item.type" name="checkmark" size="14" color="#fff"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="pay-footer">
        <u-button
          type="primary"
          :disabled="paying"
          :loading="paying"
          @click="handlePay"
        >
          立即支付
        </u-button>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { getPayMethods, PAY_TYPE } from '@/utils/pay.js'

export default {
  name: 'PayPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    amount: {
      type: [Number, String],
      default: 0
    },
    orderId: {
      type: String,
      default: ''
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedType: PAY_TYPE.WECHAT,
      paying: false,
      payMethods: []
    }
  },
  computed: {
    formatAmount() {
      const num = parseFloat(this.amount)
      return isNaN(num) ? '0.00' : num.toFixed(2)
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.initPayMethods()
      }
    }
  },
  methods: {
    initPayMethods() {
      const methods = getPayMethods()
      this.payMethods = methods.map(item => {
        if (item.type === PAY_TYPE.BALANCE) {
          return {
            ...item,
            balance: this.balance,
            disabled: this.balance < parseFloat(this.amount)
          }
        }
        return item
      })

      if (this.payMethods.length > 0) {
        const availableMethod = this.payMethods.find(m => !m.disabled)
        this.selectedType = availableMethod ? availableMethod.type : this.payMethods[0].type
      }
    },

    handleSelectPayMethod(item) {
      if (item.disabled) {
        if (item.type === PAY_TYPE.BALANCE) {
          uni.showToast({ title: '余额不足', icon: 'none' })
        }
        return
      }
      this.selectedType = item.type
    },

    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },

    async handlePay() {
      if (this.paying) return

      this.paying = true
      try {
        this.$emit('pay', {
          type: this.selectedType,
          amount: this.amount,
          orderId: this.orderId
        })
      } catch (error) {
        console.error('支付失败:', error)
      } finally {
        this.paying = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-popup {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.pay-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.pay-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.close-btn {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 10rpx;
}

.pay-content {
  padding: 32rpx;
}

.pay-amount {
  text-align: center;
  margin-bottom: 40rpx;
}

.amount-label {
  font-size: 28rpx;
  color: #999;
}

.amount-value {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-top: 16rpx;
}

.currency {
  font-size: 36rpx;
  font-weight: 500;
  color: #333;
}

.number {
  font-size: 56rpx;
  font-weight: 600;
  color: #333;
}

.pay-methods {
  border-radius: 16rpx;
  overflow: hidden;
}

.pay-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &.disabled {
    opacity: 0.5;
  }
}

.pay-left {
  display: flex;
  align-items: center;
}

.pay-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pay-info {
  margin-left: 20rpx;
}

.pay-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.pay-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.pay-right {
  display: flex;
  align-items: center;
}

.pay-balance {
  font-size: 24rpx;
  color: #999;
  margin-right: 16rpx;
}

.pay-check {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;

  &.checked {
    background: #1890ff;
    border-color: #1890ff;
  }
}

.pay-footer {
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}
</style>
