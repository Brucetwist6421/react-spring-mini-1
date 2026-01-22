package kr.or.ddit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.ddit.service.ReprSvcService;
import kr.or.ddit.vo.ReprSvcVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/reprSvc")
@Controller
@Slf4j
public class ReprSvcController {

	@Autowired
	ReprSvcService reprSvcService;
	
	@GetMapping("/create")
	public String create(ReprSvcVO reprSvcVO) {
		return "reprSvc/create";
	}
	
	@GetMapping("/detail")
	public String detail(ReprSvcVO reprSvcVO) {
		return "reprSvc/detail";
	}
	
	@PostMapping("/update")
	public String update(ReprSvcVO reprSvcVO) {
		return "redirect:/reprSvc/update";
	}
	
	@PostMapping("/delete")
	public String delete(ReprSvcVO reprSvcVO) {
		return "redirect:/reprSvc/list";
	}
	
	@GetMapping("/list")
	public String list(ReprSvcVO reprSvcVO) {
		return "reprSvc/list";
	}
}
