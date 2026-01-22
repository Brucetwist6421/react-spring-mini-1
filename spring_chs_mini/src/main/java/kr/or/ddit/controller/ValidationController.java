package kr.or.ddit.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.extern.slf4j.Slf4j;

// 유효성 검사 전용 컨트롤러
@RequestMapping("/valid")
@Controller
@Slf4j
public class ValidationController {

	@GetMapping("/validation01")
	public String validation01() {

		//jsp를 fowarding
		return "valid/validation01";
	}
	
	// 실습 2 시작
	@GetMapping("/validation02")
	public String validation02() {

		//jsp를 fowarding
		return "valid/validation02";
	}
	// 실습 2 끝
	
	// 실습 3 시작
	@GetMapping("/validation03")
	public String validation03() {

		//jsp를 fowarding
		return "valid/validation03";
	}
	// 실습 3 끝
	
	// 실습 4 시작
	@PostMapping("/validation03_process")
	public String validation03_process(
			@RequestParam(value = "id") String id,
			@RequestParam(value = "passwd") String passwd
			) {
		log.info("validation03_process id : " + id);
		log.info("validation03_process passwd : " + passwd);
		
		return "redirect:/valid/validation03";
	}
	
	// 실습 4 끝
	
	// 실습 5 시작
	@GetMapping("/validation04")
	public String validation04() {

		//jsp를 fowarding
		return "valid/validation04";
	}
	// 실습 5 끝
	
	// 실습 6 시작
	@GetMapping("/validation04_2")
	public String validation04_2() {

		//jsp를 fowarding
		return "valid/validation04_2";
	}
	// 실습 6 끝
	
	// 실습 7 시작
	@GetMapping("/validation05")
	public String validation05() {

		//jsp를 fowarding
		return "valid/validation05";
	}
	// 실습 7 끝
}
