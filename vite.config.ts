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
        secure: false // bỏ qua SSL cert tự ký khi dev
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