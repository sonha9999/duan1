import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Plugin Tailwind v4 của bạn

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/duan1/', // SỬA LỖI QUAN TRỌNG: Thêm dòng này để định nghĩa thư mục chạy trên GitHub
})