import axios from "axios";

const api = axios.create({
  // 배포 시 Nginx 프록시를 사용한다면 baseURL을 빈 문자열('')로 두거나 환경 변수를 사용하세요.
  baseURL: "http://168.107.51.143:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response || {};

    // 401 에러 처리
    if (status === 401) {
      // 백엔드 JwtAuthenticationFilter에서 보낸 code 확인
      if (data && data.code === "DUPLICATE_LOGIN") {
        alert("⚠️ " + (data.message || "다른 기기에서 로그인하여 접속이 종료되었습니다."));
      } else {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      }
      
      // 로컬 데이터 정리 및 페이지 이동
      localStorage.clear();
      window.location.href = "/"; 
    }

    console.error("API Error Status:", status);
    return Promise.reject(error);
  }
);

export default api;