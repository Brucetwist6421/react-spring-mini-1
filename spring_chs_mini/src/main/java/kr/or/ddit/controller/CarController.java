package kr.or.ddit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.ddit.service.CarService;
import kr.or.ddit.service.CustService;
import kr.or.ddit.vo.CarVO;
import kr.or.ddit.vo.CustVO;
import kr.or.ddit.vo.Item2VO;
import kr.or.ddit.vo.ItemVO;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/car")
@Controller
@Slf4j
public class CarController {
	
	@Autowired
	CarService carService;
	
	@Autowired
	CustService custService;
	
	// 실습 1 시작
	/*
	요청URI : /car/getCustList
	요청파라미터 : request
	요청방식 : post
	 */
	@GetMapping("/create")
	public String createForm(Model model) {
	    List<CustVO> custVOList = custService.getList();
	    model.addAttribute("custVOList", custVOList);
	    return "car/create"; // create.jsp 로 이동
	}
	// 실습 1 끝

	// 실습 1 다른 방법 시작
	@PostMapping("/getCustList")
	@ResponseBody 
	public List<CustVO> getCustList() {

	    List<CustVO> custVOList = this.custService.getList();
	    log.info("getCustList->custVOList : {}", custVOList);

	    return custVOList; // 
	}
	// 실습 1 다른 방법 끝
	
	// 실습 2 시작
	@PostMapping("/createPostAjax")
	@ResponseBody
	public Map<String, Object> createPostAjax(CarVO carVO) {
		log.info("createPostAjax-> carVO : {}", carVO);
		
		
//			// 1. 단일 파일업로드 -- 컨트롤러는 최대한 깔끔하게 유지하고 서비스에서 비지니스로직을 구현해야함
//			MultipartFile uploadFile = item2VO.getUploadFile();
//			MultipartFile uploadFile2 = item2VO.getUploadFile2();
//			
//			String pictureUrl = handleFileUpload(uploadFile);
//			item2VO.setPictureUrl(pictureUrl);
//
//			String pictureUrl2 = handleFileUpload(uploadFile2);
//			item2VO.setPictureUrl2(pictureUrl2);

		int result = this.carService.createPostAjax(carVO);
		
		
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("result", result);
		
		return map;
	}
	// 실습 2 끝
	
	@GetMapping("/detail")
	public String detail(CarVO carVO) {
		return "car/detail";
	}
	
	@PostMapping("/update")
	public String update(CarVO carVO) {
		return "redirect:/car/update";
	}
	
	@PostMapping("/delete")
	public String delete(CarVO carVO) {
		return "redirect:/car/list";
	}
	
	@GetMapping("/list")
	public String list(CarVO carVO) {
		return "car/list";
	}
}
