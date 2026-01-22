package kr.or.ddit.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cookie")
@Slf4j
@Controller
public class CookieController {

	// 실습 1 시작
//	@GetMapping("/cookie01")
//	public String cookie01() {
//		log.info("이것이 cookie다!");
//		
//		//fowarding
//		return "cookie/cookie01";
//		
//	}
	// 실습 1 끝
	
	// 실습 3 시작 : 실습 1 주석 처리
	@GetMapping("/cookie01")
	public String cookie01(HttpServletRequest request) {
		log.info("이것이 cookie다!");
		
		//request 객체 안에 있는 쿠키들을 확인해보자
		Cookie[] cookies = request.getCookies();
		if(cookies.length>0) {
			for(Cookie cookie : cookies) {
				log.info("설정된 쿠키의 속성 이름 : " + cookie.getName());
				log.info("설정된 쿠키의 값 : " + cookie.getValue());
			}
		}
		
		//fowarding
		return "cookie/cookie01";
		
	}
	// 실습 3 끝
	
	// 실습 2 시작
	@PostMapping("/cookie01_process")
	public String cookie01_process(
			@RequestParam(value = "id")String id,
			@RequestParam(value = "passwd") String passwd,
			HttpServletResponse response
			) {
		log.info("cookie01_process->id : " + id);
		log.info("cookie01_process->passwd : " + passwd);
		
		//아이디가 admin, 비밀번호가 java라면 쿠키 생성
		if(id.equals("admin")&&passwd.equals("java")) {
			//Cookie 객체를 생성
			Cookie cookie_id = new Cookie("userId", id); 
			Cookie cookie_pw = new Cookie("userPw", passwd);
			//response 내장 객체를 통해 쿠키를 리턴받음
			response.addCookie(cookie_id);
			response.addCookie(cookie_pw);
			
			log.info("쿠키 설정 성공!");
			log.info(id + "님 환영합니다!");
		}else {
			log.info("쿠키 설정 실패");
		}
		
		return "redirect:/cookie/cookie01";
	}
	// 실습 2 끝
	
	// 실습 4 시작 
	//모든 쿠키를 삭제
   // /cookie/cookie02
   @GetMapping("/cookie02")
   public String cookie02(HttpServletRequest request, HttpServletResponse response) {
      
      //요청시마다 쿠키를 함께 보냄. 쿠키는 request 객체에 담김
      Cookie[] cookies = request.getCookies();
      
      if(cookies!=null) {
    	  for(int i=0; i<cookies.length;i++) {
    		  cookies[i].setMaxAge(0);
    		  response.addCookie(cookies[i]);
    	  }
      }
	   
      return "redirect:/cookie/cookie01";
   }
	// 실습 4 끝
}
