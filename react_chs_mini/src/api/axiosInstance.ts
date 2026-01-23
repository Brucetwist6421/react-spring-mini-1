import axios from "axios";

const api = axios.create({
  // baseURL: "https://jsonplaceholder.typicode.com", // baseURL 은 axios 요청의 기본 URL 설정
  // baseURL: "http://localhost:5174", // 로컬 백엔드 서버 주소
  baseURL: "http://168.107.51.143:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 예: 토큰 자동 첨부
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
    console.error("API Error:", error.response?.status);
    return Promise.reject(error);
  }
);

export default api;