package kr.or.ddit.controller;

import java.io.File;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.config.BeanController;
import kr.or.ddit.service.Item2Service;
import kr.or.ddit.service.impl.CustomUser;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.UploadController;
import kr.or.ddit.vo.Item2VO;
import kr.or.ddit.vo.ItemVO;
import kr.or.ddit.vo.MemberVO;
import kr.or.ddit.vo.Item2VO;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/item2")
public class ItemController2 {
	// 실습 3 시작
	// DI(의존성 주입) -> 메소드(getUploadFolder())를 사용할 수 있음
	@Autowired
	BeanController beanController;
	// 실습 3 끝

	
	// 실습 2 시작
	// DI(의존성 주입) -> 메소드(getUploadFolder())를 사용할 수 있음
	@Autowired
	Item2Service item2Service;
	// 실습 2 끝

	// 실습 10 시작
	// DI(의존성 주입) -> 메소드(getUploadFolder())를 사용할 수 있음
	@Autowired
	UploadController uploadController;
	// 실습 10 끝

	/*
	 * 요청URI : /item/register 요청파라미터 : 요청방식 : get
	 */
	@GetMapping("/register")
	public String register() {

		// fowarding : jsp 응답
		return "item2/register";
	}

	// 실습 1 시작
	/*
	 * 요청 URI : /item/registerPost 요청방식 : post
	 */
	@PostMapping("/registerPost")
	public String registerPost(Item2VO item2VO) { // 변경
		log.info("registerPost->item2VO : " + item2VO);

		// 연월일 폴더 생성 설계

		if(item2VO.getUploadFile() != null || item2VO.getUploadFile2() != null) {
			
		
			// 연월일 폴더 생성 실행
			File uploadPath = new File(this.beanController.getUploadFolder(), this.beanController.getFolder());
	
			// 연 월 일 폴더가 없으면 폴더 생성
			if (uploadPath.exists() == false) {
				uploadPath.mkdirs();
			}
			// 스프링 파일객체의 파일명 꺼내기
			MultipartFile multipartFile = item2VO.getUploadFile();
			String uploadFileName = multipartFile.getOriginalFilename();
			log.info("registerPost->uploadFileNmae : " + uploadFileName);
			
			MultipartFile multipartFile2 = item2VO.getUploadFile2(); // 추가
			String uploadFileName2 = multipartFile2.getOriginalFilename(); // 추가
			log.info("registerPost->uploadFileName2 : " + uploadFileName2); // 추가
	
			// 같은 날 같은 이미지 업로드 시 파일 중복 방지 시작////////
			// java.util.UUID => 랜덤값 생성
			UUID uuid = UUID.randomUUID();
			UUID uuid2 = UUID.randomUUID();
	
			// 원래의 파일 이름과 구분하기 위해 _를 붙임(asdflkjs_개똥이.jpg)
			uploadFileName = uuid.toString() + "_" + uploadFileName;
			uploadFileName2 = uuid.toString() + "_" + uploadFileName2; // 추가
			// 같은 날 같은 이미지 업로드 시 파일 중복 방지 끝////////
	
			// 파일 복사 설계
			// , : \\ (파일 세퍼레이터)
			File saveFile = new File(uploadPath, uploadFileName);
			File saveFile2 = new File(uploadPath, uploadFileName2);// 추가
	
			// 2. 파일 복사 실행(설계대로)
			// 스프링파일객체.transferTo(설계)
			try {
				multipartFile.transferTo(saveFile);
				multipartFile2.transferTo(saveFile2); // 추가
			} catch (IllegalStateException | IOException e) {
				log.error(e.getMessage());
			}
	
	
			// DB ITEM 테이블에 insert
			/*
			 * Item2VO(itemId=0, itemName=삼성태블릿, price=120000, description=쓸만함 ,
			 * pictureUrl=null, uploadFile=파일객체
			 * 
			 * pictureUrl에 웹경로를 넣어주자
			 * 
			 * registry.addResourceHandler("/upload/**")
			 * .addResourceLocations("file:///D:/upload/");
			 * 
			 * 결과 : /2025/09/08/UUID_파일명.gif
			 */
			String pictureUrl = "/" + this.beanController.getFolder().replace("\\", "/") + "/" + uploadFileName;
			String pictureUrl2 = "/" + this.beanController.getFolder().replace("\\", "/") + "/" + uploadFileName2; // 추가
			log.info("registerPost->pictureUrl : " + pictureUrl);
			log.info("registerPost->pictureUrl2 : " + pictureUrl2); // 추가
	
			item2VO.setPictureUrl(pictureUrl);
			item2VO.setPictureUrl2(pictureUrl2); // 추가
		
		}

		int result = this.item2Service.registerPost(item2VO); // 변경
		log.info("registerPost->result : " + result);

		return "redirect:/item2/detail?itemId=" + item2VO.getItemId();
	}
	// 실습 1 끝
	
	

	// 실습 8 시작 -- 파라미터를 받는 여러가지 방법
	// 상세보기
	/*
	 * 요청URI : /item/detail?itemId=1 요청파라미터 : itemId=1 요청방식 : get
	 */
	@GetMapping("/detail")
	public String detail(Item2VO item2VO, @ModelAttribute(value = "item2VO2") Item2VO item2VO2, // @ModelAttribute는 생략 가능하다.
																							// Item2VO item2VO 와 같은 표현이다.
			int itemId, // 밑의 @RequestParam 는 생략 가능하다. 밑의 표현과 같다.
			@RequestParam(value = "itemId") int itemId2, @RequestParam(value = "itemId") String itemId3,
			@RequestParam Map<String, Object> map, Model model) {
		log.info("detail->item2VO : " + item2VO);
		log.info("detail->item2VO2 : " + item2VO2);
		log.info("detail->itemId2 : " + itemId2);
		log.info("detail->itemId3 : " + itemId3);
		log.info("detail->map : " + map);
		log.info("detail->model : " + model);

		// DB 조회
		item2VO = this.item2Service.detail(item2VO);
		log.info("detail->item2VO(result) : " + item2VO);

		model.addAttribute("item2VO", item2VO);

		// fowarding : jsp 응답
		return "item2/detail";
	}
	// 실습 8 끝

	// 실습 9 시작
	@GetMapping("/edit")
	public String edit(Item2VO item2VO, Model model) {
		log.info("edit->item2VO : " + item2VO);

		// 상세보기
		item2VO = this.item2Service.detail(item2VO);
		log.info("edit->item2VO(result) : " + item2VO);

		model.addAttribute("item2VO", item2VO);

		return "item2/edit";
	}
	// 실습 9 끝

	// 실습 11 시작
	/*
	 * 상품 변경 요청URI : /item/editPost 요청파라미터 :
	 * request{itemId=1,itemName=삼성태블릿2,price=120002,description=쓸만함2,
	 * pictureUrl=null,uploadFile=파일객체} 요청방식 : post
	 */
	@PostMapping("/editPost")
	public String editPost(Item2VO item2VO) {

		log.info("editPost->item2VO : " + item2VO);

		// 1. 파일업로드
		MultipartFile uploadFile = item2VO.getUploadFile();
		MultipartFile uploadFile2 = item2VO.getUploadFile2();

		log.info("editPost->uploadFile : " + uploadFile);
		log.info("editPost->uploadFile.getOriginalFilename() : " + uploadFile.getOriginalFilename());
		log.info("editPost->uploadFile.getOriginalFilename().length() : " + uploadFile.getOriginalFilename().length());

//		String pictureUrl = "";
//		// 1-1) 파일이 있을 때
//		if (uploadFile != null && uploadFile.getOriginalFilename().length() > 0) {
//			pictureUrl = this.uploadController.singleFileUpload(uploadFile);
//			item2VO.setPictureUrl(pictureUrl);
//			// 1-2) 파일이 없을 때
//		} else {
//			item2VO.setPictureUrl(null);
//		}
//		
//		String pictureUrl2 = "";
//		if (uploadFile2 != null && uploadFile2.getOriginalFilename().length() > 0) {
//			pictureUrl2 = this.uploadController.singleFileUpload(uploadFile2);
//			item2VO.setPictureUrl2(pictureUrl2);
//			// 1-2) 파일이 없을 때
//		} else {
//			item2VO.setPictureUrl2(null);
//		}
		
		// 윗 부분을 리팩토링 (handleFileUpload 메서드)
		String pictureUrl = handleFileUpload(uploadFile);
		item2VO.setPictureUrl(pictureUrl);

		String pictureUrl2 = handleFileUpload(uploadFile2);
		item2VO.setPictureUrl2(pictureUrl2);


		// 2. DB 테이블 update
		// I/U/D return 타입은 int
		int result = this.item2Service.editPost(item2VO);
		log.info("editPost->result : " + result);
		// redirect : 상세 URI 로 재요청
		return "redirect:/item2/detail?itemId=" + item2VO.getItemId();
	}
	// 실습 11 끝
	
	private String handleFileUpload(MultipartFile file) {
	    if (file != null && file.getOriginalFilename().length() > 0) {
	        return this.uploadController.singleFileUpload(file);
	    }
	    return null; // 파일이 없으면 null 리턴
	}

	// 실습 12 시작
	@PostMapping("/deletePost")
	public String deletePost(@ModelAttribute(value = "item2VO") Item2VO item2VO) {
		log.info("deletePost->item2VO : " + item2VO);

		this.item2Service.deletePost(item2VO);

		// 목록URI 재요청 : redirect
		return "redirect:/item2/list";
	}
	// 실습 12 끝

	// 실습 13 시작
	@GetMapping("/list")
	public String list(Model model,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "keyword", required= false, defaultValue = "") String keyword) {

		
//		List<Item2VO> item2VOList = this.item2Service.list();
//		log.info("list->item2VOList : " + item2VOList);

		// 실습 14 시작
		// 페이지네이션
		// 전체 행의 수
//		int total = this.item2Service.getTotal();
		int total = this.item2Service.getTotal(keyword); //실습 17 -- 위에 것 주석
		log.info("list->total : " + total);
		// 한 화면에 보여질 행의 수
		int size = 10;
		
		// 실습 15 시작
//		List<Item2VO> item2VOList = this.item2Service.list(currentPage,size);
//		log.info("list->item2VOList : " + item2VOList);
		// 실습 15 끝
		
		// 실습 16 시작 -- 실습 15 주석 처리
		log.info("list->keyword : " + keyword);
		log.info("list>>> currentPage : {}", currentPage);
		List<Item2VO> item2VOList = this.item2Service.list(currentPage,size,keyword);
		log.info("list->item2VOList : " + item2VOList);
		// 실습 16 끝

		ArticlePage<Item2VO> articlePage = new ArticlePage<>(total, currentPage, size, item2VOList, null);
		log.info("list->articlePage : " + articlePage);
		
		model.addAttribute("articlePage", articlePage);
		// 실습 14 끝

		model.addAttribute("item2VOList", item2VOList);

		// fowarding : jsp 리턴
		return "item2/list";
	}
	// 실습 13 끝
	
	// 실습 18 시작
	/*
    * 요청URI : /item2/editPostAjax
    * 요청파라미터 : formData{itemId=1,itemName=삼성태블릿2,price=120002,description=쓸만함2,
            uploadFiles=파일객체들}
    */
	@PostMapping("/editPostAjax")
	@ResponseBody
	public Map<String, Object> editPostAjax(Item2VO item2VO) {
		log.info("editPostAjax-> item2VO : {}", item2VO);
		
		
//		// 1. 단일 파일업로드 -- 컨트롤러는 최대한 깔끔하게 유지하고 서비스에서 비지니스로직을 구현해야함
//		MultipartFile uploadFile = item2VO.getUploadFile();
//		MultipartFile uploadFile2 = item2VO.getUploadFile2();
//		
//		String pictureUrl = handleFileUpload(uploadFile);
//		item2VO.setPictureUrl(pictureUrl);
//
//		String pictureUrl2 = handleFileUpload(uploadFile2);
//		item2VO.setPictureUrl2(pictureUrl2);

		int result = this.item2Service.editPostAjax(item2VO);
		
		
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("result", result);
		
		return map;
	}
	// 실습 18 끝
	
	// 실습 19 시작
	@ResponseBody
	@PostMapping("/createPostAjax")
	public Map<String, Object> createPostAjax(
			@RequestBody Item2VO item2VO,
			// 실습 20 시작 
			Principal principal,
			@AuthenticationPrincipal CustomUser customUser
			// 실습 20 끝
			){
		log.info("createPostAjax->item2VO : {}", item2VO);
		
		// 실습 21 시작
		
		// 1. writer 프로퍼티 세팅
		String writer = principal.getName();
		item2VO.setWriter(writer);
		
		// 2. CustomUser 객체에서 MemberVO 추출
		MemberVO memberVO = customUser.getMemberVO();
		log.info("createPostAjax->memberVO : {}", memberVO);
		// 실습 21 끝
		
		//insert 수행
		int result = this.item2Service.createPostAjax(item2VO);
		log.info("createPostAjax->result : {}", result);
		
		item2VO.setItemId(item2VO.getParentItemId());
		
		item2VO = this.item2Service.detail(item2VO);
		log.info("createPostAjax->item2VO : {}", item2VO);
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		map.put("result", result);
		map.put("item2VO", item2VO);
		
		// 실습 22 시작
		map.put("username", memberVO.getUserId());
		// 실습 22 끝
		
		return map;
	}
	// 실습 19 끝
	
	// 실습 23 시작
	@ResponseBody
	@PostMapping("/detailAjax")
	public Map<String, Object> detailAjax(@RequestBody Item2VO item2VO) {
		log.info("detailAjax-> item2VO : {}", item2VO);
		
		// select 실행
		item2VO = this.item2Service.detailAjax(item2VO);
		
		int result = 0;
		
		if(item2VO!=null) {
			result = 1;
		}
		
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("item2VO", item2VO);
		map.put("result", result);
		
		return map;
	}
	// 실습 23 끝
	
	// 실습 24 시작
	@ResponseBody
	@PostMapping("/modifyAjax")
	public Map<String, Object> modifyAjax(@RequestBody Item2VO item2VO) {
		log.info("modalEditConfirm-> item2VO : {}", item2VO);
		
		// select 실행
		int result = this.item2Service.modifyAjax(item2VO);
		
		
		Map<String, Object> map = new HashMap<String,Object>();
		map.put("result", result);
		
		return map;
	}
	// 실습 24 끝
	
	// 실습 25 시작
	@PostMapping("/replyListAjax")
	@ResponseBody
	public Map<String, Object> replyListAjax(@RequestBody Item2VO vo,
			@AuthenticationPrincipal CustomUser customUser) {
	    Map<String, Object> resultMap = new HashMap<>();
	    Item2VO item2VO = item2Service.detailAjax(vo);
	    
	 // 2. CustomUser 객체에서 MemberVO 추출
 		MemberVO memberVO = customUser.getMemberVO();
	    resultMap.put("item2VOList", item2VO.getItem2VOList());
	    resultMap.put("username", memberVO.getUserId());
	    return resultMap;
	}
	// 실습 25 끝
	
	// 실습 26 시작
	@ResponseBody
	@PostMapping("/deleteAjax")
	public int deleteAjax(@RequestBody Item2VO item2VO) {
		log.info("deleteAjax-> item2VO : {}", item2VO);
		
		int result = this.item2Service.deleteAjax(item2VO);
		
		return result;
	}
	// 실습 26 끝
	
	

}
