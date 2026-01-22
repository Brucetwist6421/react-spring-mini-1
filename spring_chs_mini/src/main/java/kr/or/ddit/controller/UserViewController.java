package kr.or.ddit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import lombok.extern.slf4j.Slf4j;

@PreAuthorize("isAnonymous()")
@Controller
@Slf4j
public class UserViewController {
	// 실습 2 시작
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	// 실습 2 끝
	
	// /login 요청 URI를 요청하면 login() 메서드로 매핑됨
	// 뷰리졸버에 의해 /WEB-INF/views/ + login + .jsp로 조립되어 forwarding
	// 처음부터 로그인 페이지 요청 시
	@GetMapping("/login")
	public String login() {
		log.info("login crypto" + bCryptPasswordEncoder.encode("java")); // 실습 2 때 진행
		return "login";
	}
	
	// /signup 요청 URI를 요청하면 signup() 메서드로 매핑됨
	// 뷰리졸버에 의해 /WEB-INF/views/ + signup + .jsp로 조립되어 forwarding	
	@GetMapping("/signup")
	public String signup() {
		return "signup";
	}
	
	// 실습 3 시작
	/*
	   요청URI : /login?logout
	   params : logout
	   요청방식 : get
	*/
	// 로그아웃 후 로그인 페이지 요청
	@RequestMapping(value="/login", method = RequestMethod.GET, params = "logout")
	public String loginParams(Model model) {
		model.addAttribute("message","로그아웃 되었습니다.");
		return "login";
	}
	// 실습 3 끝
	
}
