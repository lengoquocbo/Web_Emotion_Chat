import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://localhost:7138',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: {
          'localhost:7138': 'localhost',
          '*': 'localhost'
        },
        cookiePathRewrite: '/',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie)
            }
          })
        },
      },
      '/hubs': {
        target: 'https://localhost:7138',
        changeOrigin: true,
        secure: false,
        ws: true,
        cookieDomainRewrite: {
          'localhost:7138': 'localhost',
          '*': 'localhost'
        },
        cookiePathRewrite: '/',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie)
            }
          })
        },
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})