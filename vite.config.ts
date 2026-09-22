// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { compression } from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            vueDevTools(),

            // 只自动导入组件；Vue API 建议显式 import，类型更清晰
            Components({
                dirs: ['src/components'],
                dts: 'src/types/components.d.ts',
                deep: true,
            }),
            // 如需自动导入 Vue API，取消下面注释，并看「规范」章节的 globals 处理
            // AutoImport({
            //   imports: ['vue', 'vue-router', 'pinia'],
            //   dts: 'src/types/auto-imports.d.ts',
            // }),

            compression(),                       // 构建时生成 .gz
            visualizer({ open: false, gzipSize: true }),
        ],

        resolve: {
            alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
        },

        server: {
            port: 5173,
            open: false,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    rewrite: p => p.replace(/^\/api/, ''),
                },
            },
        },

        build: {
            target: 'es2018',
            sourcemap: false,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vue: ['vue', 'vue-router', 'pinia'],
                    },
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                },
            },
        },
    }
})