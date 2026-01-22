package kr.or.ddit.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
		// 실습 1 시작
		// 로그아웃 성공 시 실행
		if (auth != null && auth.getDetails() != null) { // 로그인 되어 있다면
			try {
				HttpSession session = request.getSession();
				session.invalidate(); // 세션의 속성을 모두 제거
			} catch (Exception e) {
				// 세션 무효화 중 오류 발생 시 예외 처리
				e.printStackTrace();
			}
		}
		
		// JSON 응답으로 로그아웃 성공 메세지 반환
//		response.setStatus(HttpServletResponse.SC_OK);
//		response.setContentType("application/json;charset=UTF-8");
//		response.getWriter().write("{\"message\":\"로그아웃 성공!\"}");
		// 실습 1 끝
		
		// 실습 2 시작
		response.sendRedirect("/login?logout");
		// 실습 2 끝
	}

}
