import axios from "axios";

const api = axios.create({
  // baseURL: "https://jsonplaceholder.typicode.com", // baseURL 은 axios 요청의 기본 URL 설정
  // baseURL: "http://localhost:5174", // 로컬 백엔드 서버 주소
  baseURL: "http://168.107.51.143:8080",
  timeout: 10000,
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
    // 1. 에러 응답 객체 확인
    const { status } = error.response || {};

    // 2. 401 에러(인증 만료) 처리
    if (status === 401) {
      // 이미 알림이 여러 번 뜨는 것을 방지하기 위해 
      // 현재 페이지가 로그인이 필요한 상태인지 체크하는 로직을 넣기도 합니다.
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      
      // 로컬 스토리지 싹 비우기 (accessToken, userInfo 모두 삭제)
      localStorage.clear();
      
      // 메인 페이지로 이동 및 새로고침 (상태 초기화)
      window.location.href = "/"; 
    }

    console.error("API Error Status:", status);
    return Promise.reject(error);
  }
);

export default api;