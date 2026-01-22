package kr.or.ddit.security;

import java.io.IOException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException, ServletException {
		// 권한 부족 시 로직을 구현
		// JSON 형식의 403 forbidden 오류 반환
		// 인증은 되었지만 해당 리소스에 접근할 권한이 없는 사용자가 접근을 시도할 때
		// 접근 거부처리를 함. 보통 403 오류 반환
//		response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//		response.setContentType("application/json;charset=UTF-8");
//		response.getWriter().write("{\"error\":\"접근 권한이 없습니다.\"}");
		
		// 실습 2 시작
		// 두번째 예시 jsp fowarding
		response.sendRedirect("/accessError");
		// 실습 2 끝
	}

}
