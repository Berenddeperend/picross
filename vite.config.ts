import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    //   "/localhost": "http://localhost:4000",
    // },
  },
  base: process.env.NODE_ENV === "production" ? "/nonogram/" : "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
  ],
});
