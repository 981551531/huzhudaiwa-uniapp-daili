<template>
  <view class="page-container">
    <view class="page-content">
      <!-- 按钮组件 -->
      <view class="card">
        <text class="card-title">Button 按钮</text>
        <view class="btn-group">
          <u-button type="primary" text="主要按钮" size="small" />
          <u-button type="success" text="成功按钮" size="small" />
          <u-button type="warning" text="警告按钮" size="small" />
          <u-button type="error" text="危险按钮" size="small" />
          <u-button type="info" text="信息按钮" size="small" />
        </view>
        <view class="btn-group">
          <u-button type="primary" text="镂空按钮" size="small" plain />
          <u-button type="primary" text="圆形按钮" size="small" shape="circle" />
          <u-button type="primary" text="禁用按钮" size="small" disabled />
          <u-button type="primary" text="加载中" size="small" loading />
        </view>
      </view>

      <!-- Tag 标签 -->
      <view class="card">
        <text class="card-title">Tag 标签</text>
        <view class="tag-group">
          <u-tag text="主要" type="primary" />
          <u-tag text="成功" type="success" />
          <u-tag text="警告" type="warning" />
          <u-tag text="危险" type="error" />
          <u-tag text="信息" type="info" />
        </view>
        <view class="tag-group">
          <u-tag text="镂空" type="primary" plain />
          <u-tag text="圆形" type="success" shape="circle" />
          <u-tag text="可关闭" type="warning" closable @close="handleTagClose" />
        </view>
      </view>

      <!-- 通知栏 -->
      <view class="card">
        <text class="card-title">NoticeBar 通知栏</text>
        <u-notice-bar :text="noticeText" />
        <view style="height: 20rpx;" />
        <u-notice-bar :text="noticeText" mode="closable" type="warning" />
        <view style="height: 20rpx;" />
        <u-notice-bar :text="noticeText" mode="link" type="error" />
      </view>

      <!-- 表单组件 -->
      <view class="card">
        <text class="card-title">表单组件</text>
        <u-form labelWidth="160rpx">
          <u-form-item label="输入框">
            <u-input v-model="formData.name" placeholder="请输入内容" clearable />
          </u-form-item>
          <u-form-item label="开关">
            <u-switch v-model="formData.switchVal" activeColor="#2979ff" />
          </u-form-item>
          <u-form-item label="评分">
            <u-rate v-model="formData.rate" activeColor="#ff9900" />
          </u-form-item>
          <u-form-item label="步进器">
            <u-number-box v-model="formData.number" :min="0" :max="100" />
          </u-form-item>
        </u-form>
      </view>

      <!-- 反馈组件 -->
      <view class="card">
        <text class="card-title">反馈组件</text>
        <view class="btn-group">
          <u-button type="primary" size="small" text="Toast 提示" @click="showToast" />
          <u-button type="success" size="small" text="Modal 弹窗" @click="showModal = true" />
          <u-button type="warning" size="small" text="ActionSheet" @click="showAction = true" />
          <u-button type="error" size="small" text="Notify 通知" @click="handleNotify" />
        </view>
      </view>

      <!-- 数据展示 -->
      <view class="card">
        <text class="card-title">数据展示</text>
        <u-cell-group>
          <u-cell title="单元格" value="内容" isLink />
          <u-cell title="带描述" label="描述信息" value="内容" isLink />
          <u-cell title="带图标" icon="setting" value="设置" isLink />
        </u-cell-group>
      </view>

      <!-- 进度条 -->
      <view class="card">
        <text class="card-title">LineProgress 进度条</text>
        <u-line-progress :percentage="30" activeColor="#2979ff" />
        <view style="height: 20rpx;" />
        <u-line-progress :percentage="60" activeColor="#19be6b" />
        <view style="height: 20rpx;" />
        <u-line-progress :percentage="80" activeColor="#ff9900" />
      </view>

      <!-- 空状态 -->
      <view class="card">
        <text class="card-title">Empty 空状态</text>
        <u-empty mode="data" text="暂无数据" />
      </view>

      <!-- Modal 弹窗 -->
      <u-modal
        :show="showModal"
        title="提示"
        content="这是一个 Modal 弹窗示例"
        showCancelButton
        @confirm="showModal = false"
        @cancel="showModal = false"
      />

      <!-- ActionSheet -->
      <u-action-sheet
        :show="showAction"
        :actions="actionList"
        title="请选择操作"
        @close="showAction = false"
        @select="handleActionSelect"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const noticeText = '欢迎使用 uni-app 开发框架模板，集成了 uview-plus 组件库，开箱即用。'

const formData = reactive({
  name: '',
  switchVal: true,
  rate: 3,
  number: 5
})

const showModal = ref(false)
const showAction = ref(false)

const actionList = ref([
  { name: '选项一' },
  { name: '选项二' },
  { name: '选项三', subname: '描述信息' }
])

function handleTagClose() {
  uni.showToast({ title: '标签已关闭', icon: 'none' })
}

function showToast() {
  uni.$u.toast('这是一条 Toast 提示')
}

function handleNotify() {
  uni.$u.toast('Notify 通知示例')
}

function handleActionSelect(item) {
  showAction.value = false
  uni.showToast({ title: `选择了：${item.name}`, icon: 'none' })
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

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
</style>
