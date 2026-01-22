package kr.or.ddit.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.service.CustService;
import kr.or.ddit.vo.CustVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/cust")
@Controller
@Slf4j
public class CustController {

	@Autowired
	CustService custService;
	
	@GetMapping("/create")
	public String create(CustVO custVO) {
		return "cust/create";
	}
	
	// 실습 1 시작
	/*
	요청URI : /cust/createPost
	요청파라미터 : request
	요청방식 : post
	*/
	@PostMapping("/createPost")
	public String createPost(CustVO custVO){
		
		log.info("createPost->custVO : {}", custVO);
		
		int result = this.custService.createPost(custVO);
		
		if(result > 0) {
			log.info("createPost->result : {}", result);
		}
		
		return "redirect:/cust/create";
	}
	// 실습 1 끝
	
	@GetMapping("/detail")
	public String detail(CustVO custVO) {
		return "cust/detail";
	}
	
	@PostMapping("/update")
	public String update(CustVO custVO) {
		return "redirect:/cust/update";
	}
	
	@PostMapping("/delete")
	public String delete(CustVO custVO) {
		return "redirect:/cust/list";
	}
	
	@GetMapping("/list")
	public String list(CustVO custVO) {
		return "cust/list";
	}
}
