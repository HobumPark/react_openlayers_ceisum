import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      cesium: path.resolve(__dirname, "node_modules/cesium/Source"),
    },
  },
  define: {
    // window.CESIUM_BASE_URL에 대응됨
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
  optimizeDeps: {
    include: ["cesium"],
  },
  build: {
    rollupOptions: {
      external: ['cesium'], // 필수는 아니지만, 외부 모듈로 처리 시 유용
    },
  },
});
