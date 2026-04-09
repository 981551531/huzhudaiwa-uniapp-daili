import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 取消 sass 废弃 API 的报警
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'import']
      }
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
})
