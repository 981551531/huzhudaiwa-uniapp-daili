# 项目整合文档

## 概述

本文档记录了从老项目 `old-uniapp` 整合到当前项目的公共方法、工具函数和自定义组件。

## 整合内容

### 一、工具函数 (utils/)

#### 1. location.js - 位置工具
从老项目 `plugins/utils.js` 提取并增强的位置相关工具。

**功能：**
- `getLocation()` - 获取位置信息（自动选择最佳方式）
- `getLocationByGPS()` - 通过GPS获取位置
- `getLocationByIP()` - 通过IP获取位置
- `reverseGeocode()` - 逆地理编码（经纬度转地址）
- `getCachedLocation()` - 获取缓存的位置信息
- `calculateDistance()` - 计算两点距离
- `chooseLocation()` - 选择地址（打开地图选择）

**使用示例：**
```javascript
import { getLocation, calculateDistance } from '@/utils/location.js'

// 获取位置
const location = await getLocation()
console.log(location.latitude, location.longitude)

// 计算距离
const distance = calculateDistance(39.9042, 116.4074, 31.2304, 121.4737)
console.log(distance) // 输出: 1068.5km
```

#### 2. upload.js - 文件上传工具
从老项目 `plugins/upload.js` 提取并重构的文件上传工具。

**功能：**
- `chooseImage()` - 选择图片
- `chooseVideo()` - 选择视频
- `chooseFile()` - 选择文件
- `uploadFile()` - 上传文件
- `uploadImages()` - 批量上传图片
- `compressImage()` - 压缩图片
- `getImageInfo()` - 获取图片信息
- `saveImageToPhotosAlbum()` - 保存图片到相册
- `saveVideoToPhotosAlbum()` - 保存视频到相册
- `previewImage()` - 预览图片

**使用示例：**
```javascript
import { chooseImage, uploadFile } from '@/utils/upload.js'

// 选择图片
const { tempFilePaths } = await chooseImage({ count: 9 })

// 上传图片
const result = await uploadFile({
  filePath: tempFilePaths[0],
  onProgress: (progress) => {
    console.log('上传进度:', progress.progress + '%')
  }
})
```

#### 3. permission.js - APP权限工具
从老项目 `plugins/permission.js` 提取的APP权限管理工具。

**功能：**
- `judgePermission()` - 判断权限（回调方式）
- `checkPermission()` - 检查权限（Promise方式）
- `gotoAppPermissionSetting()` - 跳转到应用权限设置
- `checkSystemEnableLocation()` - 检查系统定位服务是否开启
- `requestLocationPermission()` - 请求定位权限
- `requestCameraPermission()` - 请求相机权限
- `requestPhotoLibraryPermission()` - 请求相册权限
- `requestRecordPermission()` - 请求麦克风权限

**使用示例：**
```javascript
import { checkPermission, requestLocationPermission } from '@/utils/permission.js'

// 检查权限
const result = await checkPermission('location')
if (result === 1) {
  // 已授权
}

// 请求定位权限
requestLocationPermission(
  () => console.log('授权成功'),
  () => console.log('授权失败')
)
```

#### 4. pay.js - 支付工具
新增的支付工具，支持多种支付方式。

**功能：**
- `pay()` - 统一支付方法
- `wechatMiniPay()` - 微信小程序支付
- `wechatAppPay()` - APP微信支付
- `alipayAppPay()` - APP支付宝支付
- `wechatH5Pay()` - H5微信公众号支付
- `balancePay()` - 余额支付
- `queryPayStatus()` - 查询支付状态
- `refund()` - 申请退款
- `getPayMethods()` - 获取支付方式列表

**使用示例：**
```javascript
import { pay, PAY_TYPE } from '@/utils/pay.js'

// 发起支付
await pay({
  type: PAY_TYPE.WECHAT,
  orderId: '123456',
  amount: 100,
  payData: {
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: '',
    paySign: ''
  },
  onSuccess: (result) => console.log('支付成功', result),
  onFail: (error) => console.log('支付失败', error)
})
```

### 二、配置文件 (config/)

#### 1. dict.js - 字典配置
新增的全局字典数据管理。

**功能：**
- `getDictLabel()` - 根据字典名称和值获取标签
- `getDictColor()` - 根据字典名称和值获取颜色
- `getDictItem()` - 根据字典名称和值获取完整项
- `getDictList()` - 获取字典列表
- `getDictOptions()` - 获取字典选项（用于选择器）

**使用示例：**
```javascript
import { getDictLabel, getDictList } from '@/config/dict.js'

// 获取标签
const label = getDictLabel('orderStatus', 1) // 输出: 待支付

// 获取字典列表
const statusList = getDictList('orderStatus')
```

#### 2. enum.js - 枚举配置
新增的全局枚举定义。

**包含枚举：**
- `ORDER_STATUS` - 订单状态
- `PAY_STATUS` - 支付状态
- `PAY_TYPE` - 支付类型
- `USER_STATUS` - 用户状态
- `AUDIT_STATUS` - 审核状态
- `PRODUCT_STATUS` - 商品状态
- `GENDER` - 性别
- `COUPON_TYPE` - 优惠券类型
- `COUPON_STATUS` - 优惠券状态
- `PLATFORM` - 平台类型
- `STORAGE_KEY` - 存储键名
- `HTTP_STATUS` - HTTP状态码
- `RESPONSE_CODE` - 响应码
- `TIME` - 时间常量
- `FILE_SIZE` - 文件大小常量
- `REGEX` - 正则表达式

**使用示例：**
```javascript
import { ORDER_STATUS, REGEX } from '@/config/enum.js'

// 使用枚举值
if (order.status === ORDER_STATUS.UNPAID) {
  // 未支付
}

// 使用正则
if (REGEX.PHONE.test(phone)) {
  // 手机号格式正确
}
```

### 三、API接口 (api/)

#### index.js - API接口定义
重构的API接口管理文件，统一管理所有接口。

**包含模块：**
- `authApi` - 认证相关
- `userApi` - 用户相关
- `orderApi` - 订单相关
- `productApi` - 商品相关
- `cartApi` - 购物车相关
- `addressApi` - 地址相关
- `uploadApi` - 上传相关
- `payApi` - 支付相关
- `commonApi` - 公共接口
- `couponApi` - 优惠券相关
- `storeApi` - 门店相关
- `activityApi` - 活动相关

**使用示例：**
```javascript
import { authApi, orderApi } from '@/api/index.js'

// 登录
const loginResult = await authApi.login({
  username: 'user',
  password: '123456'
})

// 获取订单列表
const orders = await orderApi.getList({ pageNum: 1, pageSize: 10 })
```

### 四、自定义组件 (components/)

#### 1. Loading - 加载组件
新增的加载动画组件。

**Props:**
- `visible` - 是否显示
- `text` - 加载文字
- `transparent` - 是否透明背景

**使用示例：**
```vue
<template>
  <Loading :visible="loading" text="加载中..." />
</template>
```

#### 2. PayPopup - 支付弹窗组件
新增的支付方式选择弹窗组件。

**Props:**
- `visible` - 是否显示
- `amount` - 支付金额
- `orderId` - 订单ID
- `balance` - 用户余额

**Events:**
- `@pay` - 确认支付
- `@close` - 关闭弹窗

**使用示例：**
```vue
<template>
  <PayPopup
    v-model:visible="showPay"
    :amount="totalAmount"
    :order-id="orderId"
    :balance="userBalance"
    @pay="handlePay"
  />
</template>
```

#### 3. CustomPaging - 自定义分页组件
从老项目 `components/custom-paging` 提取并重构的分页组件。

**Props:**
- `modelValue` - 数据列表
- `total` - 总数
- `pageSize` - 每页数量
- `pageNum` - 当前页码
- `fixed` - 是否固定定位
- `bgColor` - 背景色
- `scrollHeight` - 滚动区域高度
- `refresherEnabled` - 是否启用下拉刷新
- `emptyText` - 空数据提示文字
- `loadmoreText` - 加载完成提示文字
- `showEmpty` - 是否显示空状态

**Events:**
- `@refresh` - 下拉刷新
- `@loadmore` - 加载更多
- `@scroll` - 滚动事件

**使用示例：**
```vue
<template>
  <CustomPaging
    v-model="list"
    :total="total"
    :page-num="pageNum"
    @refresh="handleRefresh"
    @loadmore="handleLoadmore"
  >
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </CustomPaging>
</template>
```

#### 4. Empty - 空状态组件
新增的空状态展示组件。

**Props:**
- `image` - 自定义图片
- `icon` - 图标名称
- `iconSize` - 图标大小
- `iconColor` - 图标颜色
- `text` - 提示文字
- `description` - 描述文字
- `showAction` - 是否显示操作按钮
- `actionText` - 操作按钮文字
- `actionType` - 按钮类型
- `actionSize` - 按钮大小

**Events:**
- `@action` - 操作按钮点击

**使用示例：**
```vue
<template>
  <Empty
    text="暂无订单"
    description="您还没有任何订单"
    :show-action="true"
    action-text="去购物"
    @action="goShopping"
  />
</template>
```

#### 5. CountDown - 倒计时组件
新增的倒计时组件。

**Props:**
- `time` - 倒计时时间（毫秒）
- `format` - 时间格式
- `autoStart` - 是否自动开始
- `millisecond` - 是否显示毫秒
- `separator` - 分隔符
- `showDays` - 是否显示天数

**Events:**
- `@finish` - 倒计时结束
- `@change` - 时间变化

**使用示例：**
```vue
<template>
  <CountDown
    :time="remainingTime"
    @finish="handleFinish"
  />
</template>
```

#### 6. SearchBar - 搜索栏组件
新增的搜索栏组件。

**Props:**
- `modelValue` - 搜索关键词
- `placeholder` - 占位文字
- `maxlength` - 最大长度
- `disabled` - 是否禁用
- `focus` - 是否聚焦
- `showClear` - 是否显示清除按钮
- `showAction` - 是否显示操作按钮
- `actionText` - 操作按钮文字

**Events:**
- `@search` - 搜索
- `@clear` - 清除
- `@focus` - 聚焦
- `@blur` - 失焦
- `@action` - 操作按钮点击

**使用示例：**
```vue
<template>
  <SearchBar
    v-model="keyword"
    placeholder="搜索商品"
    :show-action="true"
    @search="handleSearch"
  />
</template>
```

#### 7. PublicModule - 公共模块组件
从老项目 `components/common/public-module.vue` 提取并重构的公共模块组件。

**功能：**
- 测试环境标签显示（仅小程序环境）
- 全局加载动画
- 登录弹窗
- 微信登录弹窗
- 绑定手机号弹窗
- 支付弹窗
- APP更新检查

**Props:**
- `showTestEnvTag` - 是否显示测试环境标签

**Events:**
- `@loginSuccess` - 登录成功
- `@bindMobileSuccess` - 绑定手机号成功
- `@paySuccess` - 支付成功
- `@payClose` - 关闭支付弹窗

**使用示例：**
```vue
<template>
  <PublicModule
    :show-test-env-tag="true"
    @loginSuccess="handleLoginSuccess"
    @paySuccess="handlePaySuccess"
  />
</template>
```

#### 8. GlobalLoading - 全局加载组件
从老项目 `components/common/loading.vue` 提取的全局加载动画组件。

**Props:**
- `visible` - 是否显示
- `text` - 加载文字

**使用示例：**
```vue
<template>
  <GlobalLoading :visible="loading" text="加载中..." />
</template>
```

#### 9. LoginPopup - 登录弹窗组件
新增的手机号验证码登录弹窗组件。

**Props:**
- `visible` - 是否显示

**Events:**
- `@update:visible` - 更新显示状态
- `@success` - 登录成功

**使用示例：**
```vue
<template>
  <LoginPopup
    v-model:visible="showLogin"
    @success="handleLoginSuccess"
  />
</template>
```

#### 10. WechatLoginPopup - 微信登录弹窗组件
新增的微信授权登录弹窗组件。

**Props:**
- `visible` - 是否显示

**Events:**
- `@update:visible` - 更新显示状态
- `@success` - 登录成功

**使用示例：**
```vue
<template>
  <WechatLoginPopup
    v-model:visible="showWechatLogin"
    @success="handleWechatLoginSuccess"
  />
</template>
```

#### 11. BindMobilePopup - 绑定手机号弹窗组件
新增的绑定手机号弹窗组件，支持验证码和微信快捷绑定。

**Props:**
- `visible` - 是否显示

**Events:**
- `@update:visible` - 更新显示状态
- `@success` - 绑定成功

**使用示例：**
```vue
<template>
  <BindMobilePopup
    v-model:visible="showBindMobile"
    @success="handleBindSuccess"
  />
</template>
```

#### 12. AppUpdate - APP更新组件
从老项目 `uni_modules/zhouWei-APPUpdate` 提取并重构的APP更新组件。

**功能：**
- 自动检查更新（APP启动时）
- 手动检查更新
- 支持热更新（wgt文件）
- 支持整包更新（apk文件）
- iOS跳转App Store
- 强制更新和可选更新
- 下载进度显示

**使用示例：**
```vue
<template>
  <AppUpdate ref="appUpdateRef" />
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const appUpdateRef = ref(null)
    
    // 手动检查更新
    const checkUpdate = () => {
      appUpdateRef.value?.checkUpdate(true)
    }
    
    return {
      appUpdateRef,
      checkUpdate
    }
  }
}
</script>
```

## 目录结构

```
uniapp-hbuilderx-template/
├── api/
│   └── index.js              # API接口定义
├── components/
│   ├── index.js              # 组件统一导出
│   ├── Loading/              # 加载组件
│   ├── PayPopup/             # 支付弹窗组件
│   ├── CustomPaging/         # 分页组件
│   ├── Empty/                # 空状态组件
│   ├── CountDown/            # 倒计时组件
│   ├── SearchBar/            # 搜索栏组件
│   ├── PublicModule/         # 公共模块组件
│   │   ├── PublicModule.vue      # 主组件
│   │   ├── GlobalLoading.vue     # 全局加载
│   │   ├── LoginPopup.vue        # 登录弹窗
│   │   ├── WechatLoginPopup.vue  # 微信登录弹窗
│   │   └── BindMobilePopup.vue   # 绑定手机号弹窗
│   └── AppUpdate/            # APP更新组件
├── config/
│   ├── index.js              # 配置统一导出
│   ├── constants.js          # 常量配置
│   ├── dict.js               # 字典配置
│   ├── enum.js               # 枚举配置
│   └── env.js                # 环境配置
└── utils/
    ├── index.js              # 工具统一导出
    ├── tools.js              # 通用工具函数
    ├── auth.js               # 认证工具
    ├── request.js            # 请求工具
    ├── location.js           # 位置工具
    ├── upload.js             # 上传工具
    ├── permission.js         # 权限工具
    └── pay.js                # 支付工具
```

## 使用建议

1. **工具函数导入：**
```javascript
// 按需导入
import { getLocation, uploadFile } from '@/utils/index.js'

// 导入全部
import utils from '@/utils/index.js'
```

2. **组件注册：**
```javascript
// 在 pages.json 中配置 easycom
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^u-(.*)": "@/uni_modules/uview-ui/components/u-$1/u-$1.vue"
    }
  }
}

// 或手动注册
import { Loading, PayPopup } from '@/components/index.js'
```

3. **API调用：**
```javascript
import { authApi, orderApi } from '@/api/index.js'

// 使用 async/await
const result = await authApi.login({ username, password })

// 或使用 Promise
authApi.login({ username, password }).then(result => {
  // 成功
}).catch(error => {
  // 失败
})
```

## 注意事项

1. 所有工具函数都支持 Promise，建议使用 async/await 语法
2. 组件已适配 Vue3，使用 Composition API 或 Options API 均可
3. 位置工具需要配置地图 key，请在 `config/env.js` 中配置
4. 上传工具需要配置上传地址，请在 `config/env.js` 中配置
5. 支付工具需要根据实际业务调整支付参数

## 更新日志

### v1.1.0 (2024-01-02)
- 新增 PublicModule 公共模块组件
- 新增 GlobalLoading 全局加载组件
- 新增 LoginPopup 登录弹窗组件
- 新增 WechatLoginPopup 微信登录弹窗组件
- 新增 BindMobilePopup 绑定手机号弹窗组件
- 新增 AppUpdate APP更新组件
- 更新组件导出文件，支持12个组件

### v1.0.0 (2024-01-01)
- 从老项目提取并整合公共方法
- 新增位置、上传、权限、支付等工具
- 新增字典、枚举配置
- 重构API接口管理
- 新增6个常用组件
- 编写完整使用文档
