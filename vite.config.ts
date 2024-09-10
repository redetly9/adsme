import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip'
    ]
  },
  plugins: [react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin']
    }
  })],
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      '~app': path.resolve('src/app'),
      '~pages': path.resolve('src/pages'),
      '~layouts': path.resolve('src/layouts'),
      '~components': path.resolve('src/components'),
      '~model': path.resolve('src/model'),
      '~shared': path.resolve('src/shared')
    }
  }
})
