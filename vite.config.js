import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Tự động nhận diện: Nếu chạy trên Netlify (hoặc máy cục bộ) thì dùng '/', nếu chạy trên GitHub Actions thì dùng '/duan1/'
  base: process.env.NETLIFY ? "/" : "/duan1/",
});
