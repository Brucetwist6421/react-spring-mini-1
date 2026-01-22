import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 실습 1 시작
  // 파일 다운로드 프록시 설정
  server: {
    proxy: {
      "/download": {
        target: "http://localhost:5174", // Spring Boot 서버 주소
        changeOrigin: true,
      },
    },
  },
  // 실습 1 끝
})
