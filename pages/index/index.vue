<template>
  <view class="agent-page">
    <!-- 顶部欢迎区 -->
    <view class="welcome-section">
      <view class="welcome-content">
        <view class="welcome-left">
          <text class="agent-name">{{ agentInfo.name }}</text>
          <text class="welcome-date">{{ currentDate }} {{ weatherInfo }}</text>
        </view>
        <view class="welcome-right">
          <u-avatar :src="agentInfo.avatar" size="80" />
        </view>
      </view>
    </view>

    <!-- 数据看板区 -->
    <view class="data-section">
      <!-- 时间维度切换Tab -->
      <view class="time-tabs">
        <view
          v-for="tab in timeTabs"
          :key="tab.value"
          class="time-tab-item"
          :class="{ active: currentTimeTab === tab.value }"
          @click="switchTimeTab(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>

      <!-- 四个核心数据卡片 -->
      <view class="data-cards">
        <view class="data-card" v-for="item in dataCards" :key="item.key">
          <view class="data-value">{{ item.value }}</view>
          <view class="data-label">{{ item.label }}</view>
          <view class="data-trend" :class="item.trend > 0 ? 'up' : 'down'">
            <u-icon :name="item.trend > 0 ? 'arrow-up' : 'arrow-down'" size="20" />
            <text>{{ Math.abs(item.trend) }}%</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷功能区 (金刚区) -->
    <view class="quick-section">
      <view class="section-title">快捷功能</view>
      <view class="quick-entry">
        <view 
          class="quick-item" 
          v-for="item in quickEntries" 
          :key="item.key"
          @click="handleQuickEntry(item)"
        >
          <view class="quick-icon" :class="item.iconClass">
            <u-icon :name="item.icon" size="44" />
          </view>
          <text class="quick-text">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 待办事项区 -->
    <view class="todo-section">
      <view class="section-header">
        <text class="section-title">待办事项</text>
        <text class="section-more" @click="viewAllTodo">查看全部</text>
      </view>
      <view class="todo-list">
        <view 
          class="todo-item" 
          v-for="item in todoList" 
          :key="item.id"
          @click="handleTodoItem(item)"
        >
          <view class="todo-left">
            <view class="todo-dot" :class="item.type"></view>
            <text class="todo-text">{{ item.content }}</text>
          </view>
          <view class="todo-right">
            <text class="todo-time">{{ item.time }}</text>
            <u-icon name="arrow-right" size="28" color="#BFBFBF" />
          </view>
        </view>
      </view>
    </view>

    <!-- 最近活动 -->
    <view class="recent-section">
      <view class="section-header">
        <text class="section-title">最近活动</text>
        <text class="section-more" @click="viewAllActivities">查看全部</text>
      </view>
      <view class="activity-list">
        <view 
          class="activity-item" 
          v-for="item in recentActivities" 
          :key="item.id"
          @click="viewActivityDetail(item)"
        >
          <u-image 
            :src="item.coverUrl" 
            width="160rpx" 
            height="120rpx" 
            radius="8"
            mode="aspectFill"
          />
          <view class="activity-info">
            <text class="activity-title">{{ item.title }}</text>
            <text class="activity-date">{{ item.activityDate }}</text>
            <view class="activity-stats">
              <text class="stat-item">报名 {{ item.enrollCount }}人</text>
              <text class="stat-divider">|</text>
              <text class="stat-item">收入 ¥{{ item.income }}</text>
            </view>
          </view>
          <view class="activity-status" :class="item.statusClass">
            {{ item.statusText }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// 代理商信息
const agentInfo = reactive({
  id: 1,
  name: '北京市朝阳区代理',
  avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
  contactName: '张经理',
  contactPhone: '138****8888'
})

// 当前日期
const currentDate = ref('')
const weatherInfo = ref('晴 26°C')

// 时间维度Tab
const timeTabs = ref([
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '累计', value: 'total' }
])
const currentTimeTab = ref('today')

// 数据卡片
const dataCards = ref([
  { key: 'products', label: '产品总数', value: 28, trend: 12 },
  { key: 'activities', label: '活动总数', value: 156, trend: 8 },
  { key: 'participants', label: '累计参与人次', value: 2580, trend: 15 },
  { key: 'revenue', label: '累计营收(元)', value: 168500, trend: -3 }
])

// 快捷功能入口
const quickEntries = ref([
  { key: 'publish', label: '发布产品', icon: 'plus-circle', iconClass: 'icon-blue', path: '/pages/product/edit/edit' },
  { key: 'orders', label: '订单管理', icon: 'order', iconClass: 'icon-green', path: '/pages/order/list/list' },
  { key: 'subsidy', label: '补贴汇总', icon: 'integral', iconClass: 'icon-orange', path: '/pages/subsidy/list/list' },
  { key: 'leaders', label: '领队管理', icon: 'account', iconClass: 'icon-red', path: '/pages/leader/list/list' }
])

// 待办事项
const todoList = ref([
  { id: 1, type: 'warning', content: '有3个产品待审核', time: '10分钟前', path: '/pages/product/list/list?status=pending' },
  { id: 2, type: 'danger', content: '新增5笔退款申请', time: '30分钟前', path: '/pages/order/list/list?status=refund' },
  { id: 3, type: 'info', content: '本月业绩报告已生成', time: '1小时前', path: '/pages/report/monthly/monthly' },
  { id: 4, type: 'success', content: '新增领队认证申请2人', time: '2小时前', path: '/pages/leader/list/list?status=pending' }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    title: '百里家乡-龙坪天池亲子游',
    coverUrl: 'https://cdn.uviewui.com/uview/album/1.jpg',
    activityDate: '2026-04-15',
    enrollCount: 32,
    income: 12800,
    status: 'ongoing',
    statusText: '进行中',
    statusClass: 'status-ongoing'
  },
  {
    id: 2,
    title: '周末农场体验活动',
    coverUrl: 'https://cdn.uviewui.com/uview/album/2.jpg',
    activityDate: '2026-04-12',
    enrollCount: 28,
    income: 8400,
    status: 'completed',
    statusText: '已结束',
    statusClass: 'status-completed'
  },
  {
    id: 3,
    title: '春季亲子露营活动',
    coverUrl: 'https://cdn.uviewui.com/uview/album/3.jpg',
    activityDate: '2026-04-20',
    enrollCount: 15,
    income: 6000,
    status: 'enrolling',
    statusText: '报名中',
    statusClass: 'status-enrolling'
  }
])

// 初始化日期
function initDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[now.getDay()]
  currentDate.value = `${year}年${month}月${day}日 ${weekDay}`
}

// 切换时间维度
function switchTimeTab(tab) {
  currentTimeTab.value = tab
  // 模拟切换数据
  if (tab === 'today') {
    dataCards.value = [
      { key: 'products', label: '产品总数', value: 28, trend: 12 },
      { key: 'activities', label: '活动总数', value: 3, trend: 50 },
      { key: 'participants', label: '参与人次', value: 86, trend: 15 },
      { key: 'revenue', label: '营收(元)', value: 8500, trend: 8 }
    ]
  } else if (tab === 'week') {
    dataCards.value = [
      { key: 'products', label: '产品总数', value: 28, trend: 5 },
      { key: 'activities', label: '活动总数', value: 12, trend: 20 },
      { key: 'participants', label: '参与人次', value: 320, trend: 12 },
      { key: 'revenue', label: '营收(元)', value: 32000, trend: 10 }
    ]
  } else if (tab === 'month') {
    dataCards.value = [
      { key: 'products', label: '产品总数', value: 28, trend: 8 },
      { key: 'activities', label: '活动总数', value: 45, trend: 15 },
      { key: 'participants', label: '参与人次', value: 1280, trend: 18 },
      { key: 'revenue', label: '营收(元)', value: 98500, trend: 12 }
    ]
  } else {
    dataCards.value = [
      { key: 'products', label: '产品总数', value: 28, trend: 12 },
      { key: 'activities', label: '活动总数', value: 156, trend: 8 },
      { key: 'participants', label: '累计参与人次', value: 2580, trend: 15 },
      { key: 'revenue', label: '累计营收(元)', value: 168500, trend: -3 }
    ]
  }
}

// 快捷入口点击
function handleQuickEntry(item) {
  uni.navigateTo({ url: item.path })
}

// 查看全部待办
function viewAllTodo() {
  uni.showToast({ title: '查看全部待办', icon: 'none' })
}

// 处理待办项点击
function handleTodoItem(item) {
  uni.navigateTo({ url: item.path })
}

// 查看全部活动
function viewAllActivities() {
  uni.navigateTo({ url: '/pages/product/list/list' })
}

// 查看活动详情
function viewActivityDetail(item) {
  uni.navigateTo({ url: `/pages/product/detail/detail?id=${item.id}` })
}

// 页面加载
onMounted(() => {
  initDate()
})

// 页面显示时刷新数据
onShow(() => {
  // 刷新数据
})
</script>

<style lang="scss" scoped>
.agent-page {
  min-height: 100vh;
  background-color: #F0F2F5;
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

// 欢迎区域
.welcome-section {
  background: linear-gradient(135deg, #1890FF 0%, #40a9ff 100%);
  padding: 32rpx;
  padding-top: calc(32rpx + var(--status-bar-height, 44px));

  .welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .welcome-left {
    display: flex;
    flex-direction: column;

    .agent-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #FFFFFF;
      margin-bottom: 8rpx;
    }

    .welcome-date {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.85);
    }
  }
}

// 数据看板
.data-section {
  margin: -40rpx 24rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.time-tabs {
  display: flex;
  background-color: #F5F5F5;
  border-radius: 8rpx;
  padding: 4rpx;
  margin-bottom: 24rpx;

  .time-tab-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 26rpx;
    color: #595959;
    border-radius: 6rpx;
    transition: all 0.3s;

    &.active {
      background-color: #FFFFFF;
      color: #1890FF;
      font-weight: 500;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
    }
  }
}

.data-cards {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;

  .data-card {
    width: calc(50% - 16rpx);
    margin: 8rpx;
    background-color: #FAFAFA;
    border-radius: 8rpx;
    padding: 24rpx;
    text-align: center;

    .data-value {
      font-size: 44rpx;
      font-weight: bold;
      color: #262626;
      line-height: 1.2;
    }

    .data-label {
      font-size: 24rpx;
      color: #8C8C8C;
      margin-top: 8rpx;
    }

    .data-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      margin-top: 8rpx;

      &.up {
        color: #52C41A;
      }

      &.down {
        color: #FAAD14;
      }
    }
  }
}

// 区块通用样式
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #262626;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .section-more {
    font-size: 26rpx;
    color: #1890FF;
  }
}

// 快捷功能区
.quick-section {
  margin: 0 24rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx;

  .section-title {
    margin-bottom: 24rpx;
  }
}

.quick-entry {
  display: flex;
  flex-wrap: wrap;

  .quick-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 0;

    .quick-icon {
      width: 88rpx;
      height: 88rpx;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;

      &.icon-blue {
        background-color: rgba(24, 144, 255, 0.1);
        color: #1890FF;
      }

      &.icon-green {
        background-color: rgba(82, 196, 26, 0.1);
        color: #52C41A;
      }

      &.icon-orange {
        background-color: rgba(250, 173, 20, 0.1);
        color: #FAAD14;
      }

      &.icon-red {
        background-color: rgba(245, 34, 45, 0.1);
        color: #F5222D;
      }
    }

    .quick-text {
      font-size: 24rpx;
      color: #595959;
    }
  }
}

// 待办事项区
.todo-section {
  margin: 0 24rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx;
}

.todo-list {
  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;

    &:last-child {
      border-bottom: none;
    }

    .todo-left {
      display: flex;
      align-items: center;
      flex: 1;

      .todo-dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        margin-right: 16rpx;

        &.warning {
          background-color: #FAAD14;
        }

        &.danger {
          background-color: #F5222D;
        }

        &.info {
          background-color: #1890FF;
        }

        &.success {
          background-color: #52C41A;
        }
      }

      .todo-text {
        font-size: 28rpx;
        color: #595959;
      }
    }

    .todo-right {
      display: flex;
      align-items: center;

      .todo-time {
        font-size: 24rpx;
        color: #BFBFBF;
        margin-right: 8rpx;
      }
    }
  }
}

// 最近活动区
.recent-section {
  margin: 0 24rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx;
}

.activity-list {
  .activity-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #F0F0F0;

    &:last-child {
      border-bottom: none;
    }

    .activity-info {
      flex: 1;
      margin-left: 20rpx;

      .activity-title {
        font-size: 28rpx;
        color: #262626;
        font-weight: 500;
        display: block;
        margin-bottom: 8rpx;
      }

      .activity-date {
        font-size: 24rpx;
        color: #8C8C8C;
        display: block;
        margin-bottom: 8rpx;
      }

      .activity-stats {
        display: flex;
        align-items: center;

        .stat-item {
          font-size: 22rpx;
          color: #8C8C8C;
        }

        .stat-divider {
          margin: 0 12rpx;
          color: #E8E8E8;
        }
      }
    }

    .activity-status {
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      font-size: 22rpx;

      &.status-ongoing {
        background-color: rgba(24, 144, 255, 0.1);
        color: #1890FF;
      }

      &.status-completed {
        background-color: rgba(140, 140, 140, 0.1);
        color: #8C8C8C;
      }

      &.status-enrolling {
        background-color: rgba(82, 196, 26, 0.1);
        color: #52C41A;
      }
    }
  }
}
</style>
