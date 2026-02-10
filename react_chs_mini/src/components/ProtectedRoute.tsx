import { Navigate, Outlet } from "react-router-dom";

/**
 * 로그인이 필요한 페이지를 감싸는 래퍼 컴포넌트
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");

  // 토큰이 없으면 홈(대시보드)으로 튕겨내기
  if (!token) {
    alert("로그인이 필요한 서비스입니다.");
    return <Navigate to="/" replace />;
  }

  // 토큰이 있으면 자식 컴포넌트(Outlet)를 보여줌
  return <Outlet />;
};

export default ProtectedRoute;