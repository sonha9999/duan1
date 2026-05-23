import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Đưa react về đúng plugin của nó
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/thachcao/", // Thêm chính xác dòng này để định tuyến đúng trên GitHub Pages
});