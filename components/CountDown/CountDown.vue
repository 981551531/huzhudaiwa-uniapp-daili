<template>
  <view class="countdown-container">
    <slot :timeData="timeData" :formattedTime="formattedTime">
      <view class="countdown-default">
        <view class="countdown-item" v-if="showDays">
          <text class="countdown-value">{{ timeData.days }}</text>
          <text class="countdown-separator">{{ separator }}</text>
        </view>
        <view class="countdown-item">
          <text class="countdown-value">{{ timeData.hours }}</text>
          <text class="countdown-separator">{{ separator }}</text>
        </view>
        <view class="countdown-item">
          <text class="countdown-value">{{ timeData.minutes }}</text>
          <text class="countdown-separator">{{ separator }}</text>
        </view>
        <view class="countdown-item">
          <text class="countdown-value">{{ timeData.seconds }}</text>
        </view>
      </view>
    </slot>
  </view>
</template>

<script>
export default {
  name: 'CountDown',
  props: {
    time: {
      type: [Number, String],
      default: 0
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    autoStart: {
      type: Boolean,
      default: true
    },
    millisecond: {
      type: Boolean,
      default: false
    },
    separator: {
      type: String,
      default: ':'
    },
    showDays: {
      type: Boolean,
      default: false
    }
  },
  emits: ['finish', 'change'],
  data() {
    return {
      timer: null,
      remainTime: 0,
      timeData: {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        milliseconds: '000'
      }
    }
  },
  computed: {
    formattedTime() {
      const { days, hours, minutes, seconds } = this.timeData
      if (this.showDays) {
        return `${days}${this.separator}${hours}${this.separator}${minutes}${this.separator}${seconds}`
      }
      return `${hours}${this.separator}${minutes}${this.separator}${seconds}`
    }
  },
  watch: {
    time: {
      immediate: true,
      handler(val) {
        this.remainTime = parseInt(val)
        if (this.autoStart) {
          this.start()
        }
      }
    }
  },
  beforeUnmount() {
    this.stop()
  },
  methods: {
    start() {
      if (this.timer) return

      this.timer = setInterval(() => {
        if (this.remainTime <= 0) {
          this.stop()
          this.$emit('finish')
          return
        }

        this.remainTime -= this.millisecond ? 10 : 1000
        this.updateTimeData()
      }, this.millisecond ? 10 : 1000)

      this.updateTimeData()
    },

    stop() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    reset() {
      this.stop()
      this.remainTime = parseInt(this.time)
      this.updateTimeData()
    },

    pause() {
      this.stop()
    },

    updateTimeData() {
      const time = Math.max(0, this.remainTime)
      const days = Math.floor(time / (24 * 60 * 60 * 1000))
      const hours = Math.floor((time % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((time % (60 * 1000)) / 1000)
      const milliseconds = time % 1000

      this.timeData = {
        days: this.padZero(days),
        hours: this.padZero(hours),
        minutes: this.padZero(minutes),
        seconds: this.padZero(seconds),
        milliseconds: this.padZero(milliseconds, 3)
      }

      this.$emit('change', {
        ...this.timeData,
        remainTime: this.remainTime
      })
    },

    padZero(num, length = 2) {
      return String(num).padStart(length, '0')
    }
  }
}
</script>

<style lang="scss" scoped>
.countdown-container {
  display: inline-block;
}

.countdown-default {
  display: flex;
  align-items: center;
}

.countdown-item {
  display: flex;
  align-items: center;
}

.countdown-value {
  min-width: 40rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  background: #333;
  color: #fff;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: 8rpx;
  padding: 0 8rpx;
}

.countdown-separator {
  margin: 0 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}
</style>
