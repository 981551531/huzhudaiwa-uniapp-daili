<script>
import { useAppStore } from '@/store'

// #ifdef APP-PLUS
import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate'
// #endif

export default {
  onLaunch(options) {
    const appStore = useAppStore()
    appStore.initApp()

    // #ifdef APP-PLUS
    APPUpdate()

    plus.ad.setPrivacyConfig({
      isAdult: true,
      isCanUsePhoneState: true,
      isCanUseStorage: true,
      isCanUseLocation: true,
      isCanUseWifiState: true,
      isCanGetInstallAppList: false,
      isCanGetRunningApps: false,
      isCanGetMacAddress: true,
      isCanGetAndroidId: true,
      isCanGetOAID: true,
      isCanGetIP: true
    })
    // #endif
  }
}
</script>

<style lang="scss">
/* 注意：uview-plus 基础样式必须在第一行引入 */
@import "@/uni_modules/uview-plus/index.scss";
/* 公共样式 */
@import "@/styles/common.scss";

/* 全局基础样式 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 28rpx;
  color: #303133;
  background-color: #f5f6f8;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

/* 图片默认样式 */
image {
  width: 100%;
  height: auto;
  display: block;
}

/* 按钮重置 */
button::after {
  border: none;
}
</style>
