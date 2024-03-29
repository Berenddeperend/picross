import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import VueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/scss/variables.scss";`,
      },
    },
  },
  base: process.env.NODE_ENV === "production" ? "/nonogram/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [vue(), VueDevTools()],
});
