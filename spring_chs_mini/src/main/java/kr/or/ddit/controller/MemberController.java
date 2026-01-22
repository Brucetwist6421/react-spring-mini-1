package kr.or.ddit.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.extern.slf4j.Slf4j;

@RequestMapping("/member")
@Slf4j
@Controller
public class MemberController {
	//회원 목록 : 모두가 접근 가능
	@GetMapping("/list")
	public String list() {
		
		//fowarding : jsp를 응답
		return "member/list";
	}
	
	//회원 등록 : 로그인 된 회원만 접근 가능
	//실습 2 시작 -- SecurityConfig 실습 4,5 기타 주석 필요(hasRole, permitAll)
	//@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MEMBER')")
	//@PreAuthorize("hasRole('ROLE_MEMBER')")
	@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEMBER')")
	//실습 2 끝
	@GetMapping("/regist")
	public String regist() {
		
		//fowarding : jsp를 응답
		return "member/regist";
	}
	
}
