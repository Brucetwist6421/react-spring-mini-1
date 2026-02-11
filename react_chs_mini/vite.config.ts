import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. API 요청 프록시 설정 (LMS 대시보드 데이터 등)
      "/api": {
        target: "http://168.107.51.143:8080", // 확인된 백엔드 주소
        changeOrigin: true,
        secure: false,
        // 만약 백엔드에서 /api 경로를 기본으로 사용한다면 rewrite는 필요 없습니다.
        // 만약 백엔드 컨트롤러에 /api가 없고 바로 호출해야 한다면 아래 주석을 해제하세요.
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      // 2. 기존 다운로드 프록시 설정 (필요 시 주소 수정)
      "/download": {
        target: "http://168.107.51.143:8080", 
        changeOrigin: true,
      },
    },
  },
})