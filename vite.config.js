import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // Đã sửa: Chuyển về thư mục gốc để chạy chuẩn trên Netlify và tên miền riêng
});
