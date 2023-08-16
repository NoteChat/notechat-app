import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    base: './',
    server: {
      proxy: {
        '/v1': {
          target: 'http://127.0.0.1:3000',
          changeOrigin: true
        }
      }
    },
    publicDir: resolve(__dirname, 'src/renderer/assets'),
    build: {
      copyPublicDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      react(),
      UnoCSS({
        configFile: './uno.config.ts'
      })
    ]
  }
})
