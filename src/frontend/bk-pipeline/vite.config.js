import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.vue', '.json', '.ts', '.scss', '.css']
    },
    optimizeDeps: {
        // 预构建依赖，提高开发体验
        include: ['vue', 'uuid', 'vue-draggable-plus'],
        // 排除可选的 UI 库，让它们按需加载
        exclude: ['bk-magic-vue', 'bkui-vue']
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: ''
            }
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'index.js'),
            name: 'bkPipeline',
            fileName: (format) => {
                if (format === 'es') return 'bk-pipeline.esm.js'
                if (format === 'cjs') return 'bk-pipeline.cjs.js'
                return 'bk-pipeline.min.js'
            },
            formats: ['es', 'cjs', 'umd']
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'bk-magic-vue', 'bkui-vue', 'vue-draggable-plus'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    'bk-magic-vue': 'bkMagic',
                    'bkui-vue': 'bkuiVue',
                    'vue-draggable-plus': 'VueDraggablePlus'
                },
                // 保留样式
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'bk-pipeline.css'
                    return assetInfo.name
                }
            }
        },
        // 压缩选项
        minify: 'terser',
        terserOptions: {
            format: {
                comments: false
            }
        },
        // 输出目录
        outDir: 'dist',
        // 清空输出目录
        emptyOutDir: true,
        // 生成 sourcemap
        sourcemap: false
    },
    // 开发服务器配置（用于本地测试）
    server: {
        port: 3000,
        open: false
    }
})
