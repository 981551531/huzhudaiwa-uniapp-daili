<template>
  <view class="page-container">
    <view class="page-content">
      <!-- 日期格式化 -->
      <view class="card">
        <text class="card-title">日期格式化</text>
        <view class="demo-item">
          <text class="demo-label">当前时间：</text>
          <text class="demo-value">{{ currentTime }}</text>
        </view>
        <view class="demo-item">
          <text class="demo-label">日期格式：</text>
          <text class="demo-value">{{ dateOnly }}</text>
        </view>
        <view class="demo-item">
          <text class="demo-label">相对时间：</text>
          <text class="demo-value">{{ relativeTime }}</text>
        </view>
      </view>

      <!-- 数字格式化 -->
      <view class="card">
        <text class="card-title">数字与金额格式化</text>
        <view class="demo-item">
          <text class="demo-label">金额格式化：</text>
          <text class="demo-value">{{ formattedMoney }}</text>
        </view>
        <view class="demo-item">
          <text class="demo-label">数字简写：</text>
          <text class="demo-value">{{ formattedNumber }}</text>
        </view>
        <view class="demo-item">
          <text class="demo-label">文件大小：</text>
          <text class="demo-value">{{ formattedSize }}</text>
        </view>
      </view>

      <!-- 数据脱敏 -->
      <view class="card">
        <text class="card-title">数据脱敏</text>
        <view class="demo-item">
          <text class="demo-label">手机号：</text>
          <text class="demo-value">{{ maskedPhone }}</text>
        </view>
      </view>

      <!-- 数据验证 -->
      <view class="card">
        <text class="card-title">数据验证</text>
        <u-form labelWidth="160rpx">
          <u-form-item label="手机号">
            <u-input v-model="validateData.phone" placeholder="请输入手机号" clearable />
            <template #right>
              <u-tag :text="phoneValid ? '有效' : '无效'" :type="phoneValid ? 'success' : 'error'" size="mini" />
            </template>
          </u-form-item>
          <u-form-item label="邮箱">
            <u-input v-model="validateData.email" placeholder="请输入邮箱" clearable />
            <template #right>
              <u-tag :text="emailValid ? '有效' : '无效'" :type="emailValid ? 'success' : 'error'" size="mini" />
            </template>
          </u-form-item>
          <u-form-item label="身份证号">
            <u-input v-model="validateData.idCard" placeholder="请输入身份证号" clearable />
            <template #right>
              <u-tag :text="idCardValid ? '有效' : '无效'" :type="idCardValid ? 'success' : 'error'" size="mini" />
            </template>
          </u-form-item>
        </u-form>
      </view>

      <!-- 防抖节流 -->
      <view class="card">
        <text class="card-title">防抖与节流</text>
        <view class="demo-item">
          <text class="demo-label">防抖点击：</text>
          <text class="demo-value">{{ debounceCount }} 次</text>
        </view>
        <u-button type="primary" size="small" text="防抖按钮（300ms）" @click="handleDebounce" />
        <view style="height: 20rpx;" />
        <view class="demo-item">
          <text class="demo-label">节流点击：</text>
          <text class="demo-value">{{ throttleCount }} 次</text>
        </view>
        <u-button type="success" size="small" text="节流按钮（1000ms）" @click="handleThrottle" />
      </view>

      <!-- 其他工具 -->
      <view class="card">
        <text class="card-title">其他工具方法</text>
        <view class="demo-item">
          <text class="demo-label">UUID：</text>
          <text class="demo-value text-sm">{{ uuid }}</text>
        </view>
        <view class="demo-item">
          <text class="demo-label">平台信息：</text>
          <text class="demo-value">{{ platform }}</text>
        </view>
        <view class="demo-item">
          <text class="demo-label">状态栏高度：</text>
          <text class="demo-value">{{ statusBarHeight }}px</text>
        </view>
        <u-button type="primary" size="small" text="生成新 UUID" @click="refreshUUID" />
      </view>

      <!-- 代码示例 -->
      <view class="card">
        <text class="card-title">使用方式</text>
        <view class="code-block">
          <text class="code-text">import {
  formatDate,
  formatMoney,
  maskPhone,
  isPhone,
  isEmail,
  debounce,
  throttle,
  deepClone,
  generateUUID,
  getPlatform
} from '@/utils/tools.js'

// 日期格式化
formatDate(new Date(), 'YYYY-MM-DD')

// 金额格式化
formatMoney(12345.6)  // ¥12,345.60

// 手机号脱敏
maskPhone('13800138000')  // 138****8000

// 验证
isPhone('13800138000')  // true
isEmail('test@example.com')  // true</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  formatDate,
  timeAgo,
  formatMoney,
  formatNumber,
  formatFileSize,
  maskPhone,
  isPhone,
  isEmail,
  isIdCard,
  debounce,
  throttle,
  generateUUID,
  getPlatform,
  getStatusBarHeight
} from '@/utils/tools.js'

// 日期格式化
const currentTime = formatDate(new Date())
const dateOnly = formatDate(new Date(), 'YYYY-MM-DD')
const relativeTime = timeAgo(Date.now() - 3600000) // 1小时前

// 数字格式化
const formattedMoney = formatMoney(12345.678)
const formattedNumber = formatNumber(1234567)
const formattedSize = formatFileSize(1536000)

// 数据脱敏
const maskedPhone = maskPhone('13800138000')

// 数据验证
const validateData = reactive({
  phone: '13800138000',
  email: 'test@example.com',
  idCard: '110101199001011234'
})

const phoneValid = computed(() => isPhone(validateData.phone))
const emailValid = computed(() => isEmail(validateData.email))
const idCardValid = computed(() => isIdCard(validateData.idCard))

// 防抖节流
const debounceCount = ref(0)
const throttleCount = ref(0)

const handleDebounce = debounce(() => {
  debounceCount.value++
}, 300)

const handleThrottle = throttle(() => {
  throttleCount.value++
}, 1000)

// 其他工具
const uuid = ref(generateUUID())
const platform = getPlatform()
const statusBarHeight = getStatusBarHeight()

function refreshUUID() {
  uuid.value = generateUUID()
}
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 20rpx;
  display: block;
}

.demo-item {
  display: flex;
  align-items: center;
  padding: 10rpx 0;

  .demo-label {
    font-size: 26rpx;
    color: $text-secondary;
    width: 180rpx;
    flex-shrink: 0;
  }

  .demo-value {
    font-size: 26rpx;
    color: $text-primary;
    flex: 1;
  }
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
