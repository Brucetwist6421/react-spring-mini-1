package kr.or.ddit.security;

import java.io.IOException;
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.service.impl.CustomUser;
import kr.or.ddit.vo.MemberVO;
import kr.or.ddit.vo.TblUsersVO;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {
	
	// 실습 5 시작
	// HttpSessionRequestCache : 로그인 전 사용자가 요청했던 URL을 세션에 저장해주는 객체
	// /product/addProduct -> /login -> 로그인 성공 및 권한이 있으면 -> /product/addProduct
	HttpSessionRequestCache requestCache = new HttpSessionRequestCache(); // RequestCache Custom
	// 실습 5 끝
	

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication auth) throws IOException, ServletException {

		
		// 실습 1 시작
		// JSON 형식의 성공 메세지 반환
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write("{\"message\":\"로그인 성공.\"}");
		// 실습 1 끝
		
		// 실습 3 시작
		/*
		 * principal : 로그인한 자신
		 * 사용자가 인증(로그인)되면, Spring security는 해당 사용자를 나타내는 principal 객체를 생성
		 * 현재 로그인한 사용자가 누구인지 알 수 있음
		 * 
		 * Authentication : 인증(로그인) 정보를 담는 컨테이너. getPrincipal()로 principal 정보를 꺼낼 수 있다.
		 * getPrincipal() 시 UserDetails 객체가 반환됨
		 * 
		 * UserDetails : Spring Security가 사용자 정보를 관리하는 데 사용하는 핵심 인터페이스
		 * username, password, authorities가 있다.
		 */
		CustomUser customUser = (CustomUser) auth.getPrincipal();
//		TblUsersVO tblUsersVO = customUser.getTblUsersVO();
		// 실습 4 시작 -- 바로 윗 줄 주석처리
		MemberVO memberVO = customUser.getMemberVO();
		log.info("onAuthenticationSuccess memberVO : "+ memberVO);
		// 실습 4 끝
		
//		log.info("onAuthenticationSuccess tblUsersVO : "+ tblUsersVO);
		// 실습 3 끝
		
		// 실습 2 시작
		// 특정 페이지로 리다이렉트
//		response.sendRedirect("/notice/list");
		// 실습 2 끝
		
		// 실습 6 시작 -- 실습 2 주석 처리
		// 사용자가 로그인 전에 접근하려던 요청 확인
	    SavedRequest savedRequest = requestCache.getRequest(request, response);

	    if (savedRequest != null) {
	        // 사용자가 원래 요청한 URL이 있으면 그쪽으로 리다이렉트
	        String targetUrl = savedRequest.getRedirectUrl();
	        log.info("Redirecting to savedRequest URL: " + targetUrl);
	        response.sendRedirect(targetUrl);
	    } else {
	        // 없으면 기본 페이지로 이동
	        response.sendRedirect("/product/welcome");
	    }
		// 실습 6 끝
	}

}
