package kr.or.ddit.controller;

import java.util.Enumeration;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/session")
@Slf4j
@Controller
public class SessionController {

	// 실습 1 시작
	@GetMapping("/session01")
	public String session01() {
		
		//fowarding : jsp 응답
		return "session/session01";
	}
	// 실습 1 끝
	
	// 실습 2 시작
	/*
   * 세션을 사용하려면 세션을 생성해야 함
   1) 세션 생성 : 
      JSP 내장 객체인 session.setAttribute(String name, Object value);
      세션의 속성을 설정하면 계속 세션 상태를 유지할 수 있음.
    만약, 동일한 세션의 속성 이름으로 세션을 생성하면 마지막에 설정한 것이 세션 속성 값이 됨
    
   2) 세션 설명 :
      String name : 세션으로 사용할 세션 속성 이름. 세션에 저장된 특정 값(value)
            을 찾아오기 위한 키로 사용 됨.
      Object value : 세션 속성의 값. Object 객체 타입만 가능하므로
            int, double, char 등의 기본 타입은 사용할 수 없음
   */
	@PostMapping("/session01_process")
	public String session01_process(@RequestParam Map<String, Object> map,
			HttpSession session) {
		
		log.info("session01_process->map : "+map);

		String id = (String) map.getOrDefault("id", "");
		String passwd = (String) map.getOrDefault("passwd", "");
		
		if(id.equals("admin")&&passwd.equals("java")) {
			
			//세션객체		속성		  속성명    속성값
			session.setAttribute("userId", id);
			session.setAttribute("passwd", passwd);
			
			log.info("세션 설정 성공!");
			log.info(id + "님 환영합니다.");
		}else {
			log.info("세션 설정 실패");
		}
		
		//fowarding : jsp 응답
		return "session/session02";
	}
	// 실습 2 끝
	
	// 실습 3 시작
	@GetMapping("/session03")
	public String session03(HttpSession session) {
		// =========================================================
	    // 1. 특정 세션 속성 삭제
	    // 세션에서 "passwd"라는 이름의 속성을 삭제
	    // removeAttribute()를 호출하면 해당 이름의 속성이 세션에서 제거됨
	    // =========================================================
	    session.removeAttribute("passwd");

	    // =========================================================
	    // 2. 로그 출력용 안내 메시지
	    // 세션 속성을 삭제한 이후 로그를 남기기 위해 출력
	    // =========================================================
	    log.info("=======세션 삭제 후==========");

	    // =========================================================
	    // 3. 세션에 저장된 모든 속성명을 가져오기
	    // session.getAttributeNames()는 Enumeration<String> 타입 반환
	    // Enumeration은 자바의 고전 컬렉션 반복자와 유사하며,
	    // hasMoreElements()와 nextElement()로 반복
	    // =========================================================
	    Enumeration<String> en = session.getAttributeNames();

	    // =========================================================
	    // 4. Enumeration을 이용한 반복
	    // hasMoreElements(): 다음 요소가 있는지 확인 (true/false)
	    // nextElement(): 다음 요소(세션 속성명) 반환
	    // =========================================================
	    while(en.hasMoreElements()) {
	        // 세션 속성명 가져오기
	        String name = en.nextElement();

	        // 세션 속성값 가져오기
	        // getAttribute()는 Object 타입 반환
	        // null 체크를 통해 NullPointerException 방지
	        Object attr = session.getAttribute(name);
	        //조건식 ? 조건이 true일 때 값 : 조건이 false일 때 값
	        String value = (attr != null) ? attr.toString() : "null";

	        // 로그로 세션 속성명과 값 출력
	        // String.format 사용으로 가독성 향상
	        log.info(String.format("name: %s, value: %s", name, value));
	    }

	    // =========================================================
	    // 5. JSP 페이지로 포워딩
	    // return 값은 뷰 이름(View Name)으로 사용
	    // /WEB-INF/views/session/session02.jsp 로 포워딩
	    // =========================================================
	    return "session/session02";
	}
	// 실습 3 끝
	
	// 실습 4 시작
	@GetMapping("/session04")
	public String session04(HttpServletRequest request) {
		//request 객체에 포함된 클라이언트 세션이 유효한지 체킹
		if(request.isRequestedSessionIdValid()) {
			log.info("세션이 유효합니다.");
			HttpSession session =request.getSession();
			//세션에 저장된 모든 세션 속성 삭제
			session.invalidate();//로그아웃
		}else {
			log.info("세션이 유효하지 않습니다.");
		}
		log.info("세션 속성 모두 삭제 후============.");
		
		if(request.isRequestedSessionIdValid()) {
			HttpSession session =request.getSession();
			log.info("세션이 유효합니다.");
		}else {
			log.info("세션이 유효하지 않습니다.");
		}
		//fowarding : jsp 이동
		return "session/session02";
	}
	// 실습 4 끝
	
	// 실습 5 시작
	@GetMapping("/session05")
	public String session05(HttpSession session) {
		//세션에 설정된 유효 시간(기본 1800초(30분))
		int time = session.getMaxInactiveInterval(); //초단위
		
		//세션 유효 시간 : 1800 초
		log.info("세션 유효 시간 :" + time + "초");
		
		//세션 유효 시간을 60x60(1시간)으로 설정
		session.setMaxInactiveInterval(60 * 60);//초단위
		time = session.getMaxInactiveInterval();
		
		//세션 유효 시간 : 3600 초
		log.info("세션 유효 시간 :" + time + "초");
		
		//fowarding : jsp 이동
		return "session/session02";
	}
	// 실습 5 끝
	
	// 실습 6 시작
	@GetMapping("/session06")
	public String session06(HttpSession session) {
		
		//고유한 세션 내장 객체의 아이디
		String sessionId = session.getId();
		log.info("session06->sessionId : " + sessionId);
		
		//세션이 생성된 시간
		//1970년 1월 1일 이후 흘러간 시간을 의미. 단위는 1/1000초
		long startTime = session.getCreationTime();
		log.info("session06->startTime : " + startTime);
		
		//세션에 마지막으로 접근한 시간
		//1970년 1월 1일 이후 흘러간 시간을 의미. 단위는 1/1000초
		long lastTime = session.getLastAccessedTime();
		log.info("session06->lastTime : " + lastTime);
		
		//시스템에 머문 시간(1/1000초)
		long stayedTimeMs = lastTime - startTime;     // 밀리초
		long stayedTimeMin = stayedTimeMs / (1000 * 60); // 분
		log.info("session06->stayedTime : " + stayedTimeMin);
		//fowarding : jsp 이동
		return "session/session02";
	}
	// 실습 6 끝
}
