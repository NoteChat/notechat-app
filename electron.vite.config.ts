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
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/main.html'),
          commandPalette: resolve(__dirname, 'src/renderer/commandPalette.html')
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
