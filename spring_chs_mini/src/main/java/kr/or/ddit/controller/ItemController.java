package kr.or.ddit.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.config.BeanController;
import kr.or.ddit.service.ItemService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.util.UploadController;
import kr.or.ddit.vo.ItemVO;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/item")
public class ItemController {
	// 실습 3 시작
	// DI(의존성 주입) -> 메소드(getUploadFolder())를 사용할 수 있음
	@Autowired
	BeanController beanController;
	// 실습 3 끝

	// 실습 6 시작
	// DI(의존성 주입) -> 메소드(getUploadFolder())를 사용할 수 있음
	@Autowired
	ItemService itemService;
	// 실습 6 끝

	// 실습 10 시작
	// DI(의존성 주입) -> 메소드(getUploadFolder())를 사용할 수 있음
	@Autowired
	UploadController uploadController;
	// 실습 10 끝

	// 실습 1 시작
	/*
	 * 요청URI : /item/register 요청파라미터 : 요청방식 : get
	 */
	// 실습 18 시작
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	// 실습 18 끝
	@GetMapping("/register")
	public String register() {

		// fowarding : jsp 응답
		return "item/register";
	}
	// 실습 1 끝

	// 실습 2 시작
	/*
	 * 요청 URI : /item/registerPost 요청방식 : post
	 */
	@PostMapping("/registerPost")
	public String registerPost(ItemVO itemVO) {
		log.info("registerPost->itemVO : " + itemVO);

		// 실습 4 시작
		// 연월일 폴더 생성 설계

		// 연월일 폴더 생성 실행
		File uploadPath = new File(this.beanController.getUploadFolder(), this.beanController.getFolder());

		// 연 월 일 폴더가 없으면 폴더 생성
		if (uploadPath.exists() == false) {
			uploadPath.mkdirs();
		}
		// 스프링 파일객체의 파일명 꺼내기
		MultipartFile multipartFile = itemVO.getUploadFile();
		String uploadFileName = multipartFile.getOriginalFilename();
		log.info("registerPost->uploadFileNmae : " + uploadFileName);

		// 같은 날 같은 이미지 업로드 시 파일 중복 방지 시작////////
		// java.util.UUID => 랜덤값 생성
		UUID uuid = UUID.randomUUID();

		// 원래의 파일 이름과 구분하기 위해 _를 붙임(asdflkjs_개똥이.jpg)
		uploadFileName = uuid.toString() + "_" + uploadFileName;
		// 같은 날 같은 이미지 업로드 시 파일 중복 방지 끝////////

		// 파일 복사 설계
		// , : \\ (파일 세퍼레이터)
		File saveFile = new File(uploadPath, uploadFileName);

		// 2. 파일 복사 실행(설계대로)
		// 스프링파일객체.transferTo(설계)
		try {
			multipartFile.transferTo(saveFile);
		} catch (IllegalStateException | IOException e) {
			log.error(e.getMessage());
		}

		// 실습 4 끝

		// 실습 5 시작
		// DB ITEM 테이블에 insert
		/*
		 * ItemVO(itemId=0, itemName=삼성태블릿, price=120000, description=쓸만함 ,
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
		log.info("registerPost->pictureUrl : " + pictureUrl);

		itemVO.setPictureUrl(pictureUrl);

		int result = this.itemService.registerPost(itemVO);
		log.info("registerPost->result : " + result);
		// 실습 5 끝

//		return "success";
		// 실습 7 시작(위에 것을 주석처리 후 작성), responseBody 삭제
		return "redirect:/item/detail?itemId=" + itemVO.getItemId();
		// 실습 7 끝
	}
	// 실습 2 끝

	// 실습 8 시작 -- 파라미터를 받는 여러가지 방법
	// 상세보기
	/*
	 * 요청URI : /item/detail?itemId=1 요청파라미터 : itemId=1 요청방식 : get
	 */
	@GetMapping("/detail")
	public String detail(ItemVO itemVO, @ModelAttribute(value = "itemVO2") ItemVO itemVO2, // @ModelAttribute는 생략 가능하다.
																							// ItemVO itemVO 와 같은 표현이다.
			int itemId, // 밑의 @RequestParam 는 생략 가능하다. 밑의 표현과 같다.
			@RequestParam(value = "itemId") int itemId2, @RequestParam(value = "itemId") String itemId3,
			@RequestParam Map<String, Object> map, Model model) {
		log.info("detail->itemVO : " + itemVO);
		log.info("detail->itemVO2 : " + itemVO2);
		log.info("detail->itemId2 : " + itemId2);
		log.info("detail->itemId3 : " + itemId3);
		log.info("detail->map : " + map);
		log.info("detail->model : " + model);

		// DB 조회
		itemVO = this.itemService.detail(itemVO);
		log.info("detail->itemVO(result) : " + itemVO);

		model.addAttribute("itemVO", itemVO);

		// fowarding : jsp 응답
		return "item/detail";
	}
	// 실습 8 끝

	// 실습 9 시작
	@GetMapping("/edit")
	public String edit(ItemVO itemVO, Model model) {
		log.info("edit->itemVO : " + itemVO);

		// 상세보기
		itemVO = this.itemService.detail(itemVO);
		log.info("edit->itemVO(result) : " + itemVO);

		model.addAttribute("itemVO", itemVO);

		return "item/edit";
	}
	// 실습 9 끝

	// 실습 11 시작
	/*
	 * 상품 변경 요청URI : /item/editPost 요청파라미터 :
	 * request{itemId=1,itemName=삼성태블릿2,price=120002,description=쓸만함2,
	 * pictureUrl=null,uploadFile=파일객체} 요청방식 : post
	 */
	@PostMapping("/editPost")
	public String editPost(ItemVO itemVO) {

		log.info("editPost->itemVO : " + itemVO);

		// 1. 파일업로드
		MultipartFile uploadFile = itemVO.getUploadFile();

		log.info("editPost->uploadFile : " + uploadFile);
		log.info("editPost->uploadFile.getOriginalFilename() : " + uploadFile.getOriginalFilename());
		log.info("editPost->uploadFile.getOriginalFilename().length() : " + uploadFile.getOriginalFilename().length());

		String pictureUrl = "";
		// 1-1) 파일이 있을 때
		if (uploadFile != null && uploadFile.getOriginalFilename().length() > 0) {
			pictureUrl = this.uploadController.singleFileUpload(uploadFile);
			itemVO.setPictureUrl(pictureUrl);
			// 1-2) 파일이 없을 때
		} else {
			itemVO.setPictureUrl(null);
		}

		// 2. DB 테이블 update
		// I/U/D return 타입은 int
		int result = this.itemService.editPost(itemVO);
		log.info("editPost->result : " + result);
		// redirect : 상세 URI 로 재요청
		return "redirect:/item/detail?itemId=" + itemVO.getItemId();
	}
	// 실습 11 끝

	// 실습 12 시작
	@PostMapping("/deletePost")
	public String deletePost(@ModelAttribute(value = "itemVO") ItemVO itemVO) {
		log.info("deletePost->itemVO : " + itemVO);

		this.itemService.deletePost(itemVO);

		// 목록URI 재요청 : redirect
		return "redirect:/item/list";
	}
	// 실습 12 끝

	// 실습 13 시작
	@GetMapping("/list")
	public String list(Model model,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			@RequestParam(value = "keyword", required= false, defaultValue = "") String keyword) {

		
//		List<ItemVO> itemVOList = this.itemService.list();
//		log.info("list->itemVOList : " + itemVOList);

		// 실습 14 시작
		// 페이지네이션
		// 전체 행의 수
//		int total = this.itemService.getTotal();
		int total = this.itemService.getTotal(keyword); //실습 17 -- 위에 것 주석
		log.info("list->total : " + total);
		// 한 화면에 보여질 행의 수
		int size = 10;
		
		// 실습 15 시작
//		List<ItemVO> itemVOList = this.itemService.list(currentPage,size);
//		log.info("list->itemVOList : " + itemVOList);
		// 실습 15 끝
		
		// 실습 16 시작 -- 실습 15 주석 처리
		log.info("list->keyword : " + keyword);
		List<ItemVO> itemVOList = this.itemService.list(currentPage,size,keyword);
		log.info("list->itemVOList : " + itemVOList);
		// 실습 16 끝

		ArticlePage<ItemVO> articlePage = new ArticlePage<>(total, currentPage, size, itemVOList, null);
		log.info("list->articlePage : " + articlePage);
		
		model.addAttribute("articlePage", articlePage);
		// 실습 14 끝

		model.addAttribute("itemVOList", itemVOList);

		// fowarding : jsp 리턴
		return "item/list";
	}
	// 실습 13 끝
	
	// 실습 19 시작
	/*아작났어유..피씨다타써
    요청URI : /item/editPostAjax
    요청파라미터 : {itemId=1,itemName=삼성태블릿2,price=120002,description=쓸만함2,uploadFiles=파일객체들}
    요청방식 : post
    
    dataType : 응답타입
    */
	@PostMapping("/editPostAjax")
	public ResponseEntity<Map<String,Object>> editPostAjax(@ModelAttribute ItemVO itemVO){
		log.info("editPostAjax->itemVO : "+ itemVO);
		
		//파일업로드 + insert + update
		int result = this.itemService.editPostAjax(itemVO);
		
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("result", result);
		
		return new ResponseEntity<Map<String,Object>>(map, HttpStatus.OK);
	}
	// 실습 19 끝

}
