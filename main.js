import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './store'

import uviewPlus, { http } from '@/uni_modules/uview-plus'
import tools from '@/utils/tools.js'
import { getEnvConfig } from '@/config/env.js'
import publicModule from '@/components/PublicModule/PublicModule.vue'

const envConfig = getEnvConfig()
http.setConfig((config) => {
  config.baseURL = envConfig.BASE_URL
  return config
})

export function createApp() {
  const app = createSSRApp(App)

  app.component('public-module', publicModule)
  app.use(pinia)
  app.use(uviewPlus)

  app.config.globalProperties.$tools = tools
  app.config.globalProperties.$envConfig = envConfig

  return {
    app,
    pinia
  }
}
