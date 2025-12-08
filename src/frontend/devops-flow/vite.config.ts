import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: 'local.devops.woa.com',
    https: {
      cert: './local.devops.woa.com+3.pem',
      key: './local.devops.woa.com+3-key.pem',
    }, // 启用 HTTPS，证书由 basicSsl 插件自动生成
    proxy: {
      '/ms': {
        target: 'https://dev.devops.woa.com',
        changeOrigin: true,
      },
    },
  },

  optimizeDeps: {
    exclude: ['bkui-pipeline'],
  },
})
