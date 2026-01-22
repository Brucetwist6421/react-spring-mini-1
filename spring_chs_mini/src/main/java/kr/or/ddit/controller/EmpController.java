package kr.or.ddit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.ddit.service.EmpService;
import kr.or.ddit.vo.CustVO;
import kr.or.ddit.vo.EmpVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/emp")
@Controller
@Slf4j
public class EmpController {

	@Autowired
	EmpService empService;
	
	@GetMapping("/create")
	public String create(EmpVO empVO) {
		return "emp/create";
	}
	
	// 실습 1 시작
	/*
	요청URI : /emp/createPost
	요청파라미터 : request
	요청방식 : post
	*/
	@PostMapping("/createPost")
	public String createPost(EmpVO empVO){
		
		log.info("createPost->custVO : {}", empVO);
		
		int result = this.empService.createPost(empVO);
		
		if(result > 0) {
			log.info("createPost->result : {}", result);
		}
		
		return "redirect:/emp/create";
	}
	// 실습 1 끝
	
	@GetMapping("/detail")
	public String detail(EmpVO empVO) {
		return "emp/detail";
	}
	
	@PostMapping("/update")
	public String update(EmpVO empVO) {
		return "redirect:/emp/update";
	}
	
	@PostMapping("/delete")
	public String delete(EmpVO empVO) {
		return "redirect:/emp/list";
	}
	
	@GetMapping("/list")
	public String list(EmpVO empVO) {
		return "emp/list";
	}
}
