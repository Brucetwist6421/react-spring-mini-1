package kr.or.ddit.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.extern.slf4j.Slf4j;

@RequestMapping("/response")
@Slf4j
@Controller
public class ResponseController {

	// 실습 1 시작
	@GetMapping("/response01")
	public String response01() {
		// fowarding : jsp 응답
		return "/request/response01";
	}
	// 실습 1 끝

	// 실습 2 시작
	/*
	 * 요청URI : /request/response01Post 요청파라미터 : request(Body){id=a001,password=java}
	 * 요청방식 : post
	 * 
	 * String id (O) RequestParam String id (O) RequestParam(value="id") String id
	 * (O)
	 * 
	 * [ResponseEntity] 
	 * 1. 정의 - Spring Framework에서 HTTP 응답을 나타내는 클래스 
	 * 2. 목적 - 개발자가 HTTP Status(상태 코드), 본문(body)를 직접 제어할 수 있음 
	 * 3. 이유 - 비동기 방식에서 JSON 데이터 응답 시 상태 코드를 동적으로 변경, 헤더에 추가 정보를 담음 
	 * 4. HTTP Status Code - 200(OK) : 응답 성공 
	 * -201(Created) : 생성 - 404(Not Found) : URL 또는 jsp가 없을 때 
	 * - 500(Internal Server Error) : 개발자 오류
	 */
	@ResponseBody
	@PostMapping("/response01Post")
	public ResponseEntity<String> response01Post(String id, @RequestParam(value = "password") String password,
			@RequestParam Map<String, Object> map) {

		log.info("response01Post id : " + id);
		log.info("response01Post password : " + password);
		log.info("response01Post map : " + map);

		// equals 와 == 문자열 비교 시엔 equals 를 쓰기
		if ("a001".equals(id) && "java".equals(password)) { // 관리자
//			return "redirect:/product/welcome";
			return ResponseEntity.status(HttpStatus.FOUND).header("Location", "/product/welcome").body("관리자 입니다.");
		} else { // 관리자가 아닐 때
//	    	return "redirect:/response/response01";
			// 404 Not Found 와 같이 본문이 필요없는 응답을 보낼 때 사용. .build() : 응답 본문 없음
//	    	return ResponseEntity.notFound().build();
			return ResponseEntity.status(HttpStatus.FOUND) // 406
					.header("Location", "/product/welcome").body("관리자가 아닙니다");
		}

	}
	// 실습 2 끝

	// 실습 3 시작
	@GetMapping("/response02")
	public String response02() {
		// fowarding : jsp 응답
		return "/request/response02";
	}
	// 실습 3 끝

}
