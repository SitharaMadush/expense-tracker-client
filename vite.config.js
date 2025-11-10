import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import path from 'path'

export default defineConfig({
  plugins: [vue(), tailwind()],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
