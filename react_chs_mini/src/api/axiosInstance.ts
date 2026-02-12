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
  /* 시큐리티 적용 시 주석 풀어줘야 함
  (error) => {
    if (error.response && error.response.status === 401) {
      const { code } = error.response.data;
      console.log("API 401 Error Code:", code);

      
      // 중복 로그인 코드가 왔을 때
      if (code === "DUPLICATE_LOGIN") {
        alert("다른 기기에서 로그인하여 접속이 종료됩니다.");
        localStorage.clear(); // 토큰 삭제
        window.location.href = "/"; // 메인 또는 로그인 페이지로 강제 이동
        return Promise.reject(error);
      } 
      
      // 일반적인 인증 실패 시 (토큰 만료 등)
      alert("인증이 유효하지 않습니다. 다시 로그인해주세요.");
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
    */
);

export default api;