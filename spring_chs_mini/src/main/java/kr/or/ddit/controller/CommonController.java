package kr.or.ddit.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class CommonController {

	// 실습 1 시작
	//인가(권한)가 안됨. 즉 로그인은 되어 있는 상태. 로그인 정보를 받아올 수 있음
	@GetMapping("/accessError")
	public String accessError(Authentication auth, Model model) {
		//auth : 로그인 정보가 들어있다.
		log.info("accessError : "+auth);
		
		model.addAttribute("msg","권한이 없습니다.");     
		
		return "accessError";
	}
	// 실습 1 끝                                                                    
}
