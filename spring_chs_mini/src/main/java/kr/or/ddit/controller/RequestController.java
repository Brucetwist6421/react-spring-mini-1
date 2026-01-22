package kr.or.ddit.controller;

import java.io.File;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.ddit.vo.FormVO;
import lombok.extern.slf4j.Slf4j;

// 클래스 레벨에서 요청 URI 세팅
@Slf4j
@RequestMapping("/request")
@Controller
public class RequestController {

	// 실습 1 시작
	/*
	 * 요청URI : /request/request 요청파라미터 : 요청방식 : get
	 */
	@GetMapping("/request")
	public String request(Model model) {

		// fowarding : jsp 응답
		model.addAttribute("title", "request연습");
		return "request/request";
	}

	// 실습 1 끝

	// 실습 2 시작
	/*
	 * 요청URI : /request/requestProcess 요청파라미터 : request{name=개똥이} 요청방식 : post
	 */
	@PostMapping("/requestProcess")
	public String requestProcess(HttpServletRequest request, String name, @RequestParam Map<String, Object> map,
			// 실습 6 시작
			/* 
			MultipartFile : 파일을 업로드할 때 사용되는 인터페이스. 스프링프레임워크에서 제공함
			   1) 업로드 된 파일 명, 크기, MIME 타입 접근(업로드)
			   2) 파일을 스트림으로 읽거나, 바이트 배열로 변환 가능(다운로드)
			   3) 서버의 특정 경로에 파일 저장하는 메소드 제공(Client 파일을 서버로 저장)
			 */
			MultipartFile uploadFile ) { 
		// 파일명
		String fileName = uploadFile.getOriginalFilename();
		// 크기
		long fileSize = uploadFile.getSize();
		//MIME(Multipurpose Internet Mail Extension) 타입 -- 파일 확장자
		String contentType = uploadFile.getContentType();
		
		log.info("requestProcess->uploadFile : " + uploadFile); 
		log.info("requestProcess->fileName : " + fileName);
		log.info("requestProcess->fileSize : " + fileSize);
		log.info("requestProcess->contentType : " + contentType);
		
		// 실습 6 끝
		
		String reqName = request.getParameter("name");
		
		log.info("requestProcess->reqName : " + reqName);
		log.info("requestProcess->name : " + name);
		log.info("requestProcess->map : " + map);

		// 요청 헤더의 모든 이름을 가져오기
		Enumeration en = request.getHeaderNames();

		// hasMoreElements() : 다음 값이 있을 때에만 반복
		while (en.hasMoreElements()) {
			// 다운 캐스팅
			String headerName = (String) en.nextElement();
			String headerValue = request.getHeader(headerName);

			log.info("headerName : " + headerValue);
		}

		// 실습 7 시작
		// 파일 복사(Client -> Server)
		// 파일 객체 설계(복사할 대상 경로, 파일명)
		// window 경로는 역슬래시 두개
		// c:\\sts431\\upload\\
		File uploadPath = new File("c:\\workspace\\upload");
		
		File saveFile = new File(uploadPath, fileName);

		// 파일 저장
		// 스프링파일객체.transferTo
		try {
			uploadFile.transferTo(saveFile);
		} catch (IllegalStateException | IOException e) {
			log.info(e.getMessage());
		}
		
		// DB 등록
		
		// 실습 7 끝

		// redirect: 새로운 URI 재요청
		return "redirect:/request/request";
	}

	// 실습 2 끝

	// 실습 3 진행
	/*
	 * 요청URI : /request/form01 요청파라미터 : 요청방식 : get
	 */
	@GetMapping("/form01")
	public String form01() {

		return "request/form01";
	}

	// 실습 3 끝

	// 실습 4 진행
	/*
	 * 요청URL : /request/form01Post 요청파라미터 :
	 * request{id=a001,passwd=java,name=개똥이,phone1=010,phone2=1235,phone3=6780,
	 * gender=여성,hobby=read,movie,city=city01,food=ddeukboki,kmichijjigae} 
	 * 요청방식 : post
	 */
	// 데이터 응답 시 꼭! ResponseBody
	@ResponseBody
	@PostMapping("/form01Post")
	public FormVO form01Post(FormVO formVO,
			HttpServletRequest request ) { // 실습 5 때 추가
		log.info("form01Post->formVO : " + formVO);

		// 실습 5 시작
		// 모든 요청 파라미터 명을 가져옴
		Enumeration paramNames = request.getParameterNames();
		
		String name ="";;
		String paramValue="";
		String[] paramValues;
		
		// 이 모든 과정을 Spring boot 에서는 VO 로 사용 한다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		while(paramNames.hasMoreElements()) {
			name = (String)paramNames.nextElement();
			log.info("name : "+ name);
			
			if(name.equals("hobby") || name.equals("food")) { // 다중 선택
				paramValues = request.getParameterValues(name);
				
				for(String value : paramValues) {
					log.info("name : " + name + "value : " + value);
				}
			} else { // 하나 선택
				paramValue = request.getParameter(name);
				log.info("paramValue : "+ paramValue);
			}
		}
		
		
		// 실습 5 끝
		
		// 데이터 응답
		return formVO;
	}

	// 실습 4 끝

}
