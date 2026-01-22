package kr.or.ddit.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import kr.or.ddit.service.BookService;
import kr.or.ddit.util.ArticlePage;
import kr.or.ddit.vo.BookVO;
import lombok.extern.slf4j.Slf4j;

/*
Controller 어노테이션
스프링 프레임워크에게 "이 클래스는 웹 브라우저의 요청(request)를
받아들이는 컨트롤러야" 라고 알려주는 것임.
스프링은 servlet-context.xml의 context:component-scan의 설정에 의해
이 클래스를 자바빈 객체로 등록(메모리에 바인딩).

log.info : 썰
써ㄹ풀4람
*/
@Slf4j
@Controller
public class BookController {

	// 서비스를 호출하기 위해 의존성 주입(Dependency Injection-DI)
	// IoC(Inversion of Control) - 제어의 역전.(개발자가 객체생성하지 않고 스프링이 객체를 미리 생성해놓은 것을 개발자가
	// 요청)
	// IoC(Inversion Of Control) : 제어의 역전
	@Autowired
	BookService bookService;

	// 책 입력 화면 -- 실습 1 시작
	/*
	 * 요청URI : /create 요청파라미터 : 없음 요청방식 : get
	 */
	// RequesetMapping 어노테이션 : 웹 브라우저의 요청에 실행되는 자바 메소드 지정
	/*
	 * method 속성은 http 요청 메소드를 의미함. 일반적인 웹 페이지 개발에서 GEt 메소드는 데이터를 변경하지 않는 경우에, POST
	 * 메소드는 데이터가 변경될 경우 사용 책 생성 화면은 웹 브라우저에 화면을 보여줄 뿐 데이터의 변경이 일어나지 않으므로 GET 메소드를
	 * 사용함
	 */
	@RequestMapping(value = "/create", method = RequestMethod.GET)
	public ModelAndView create() {
		log.info("도서 입력");
		/*
		 * ModelAndView 1) Model : Controller가 반환할 데이터(String, int, List, Map, VO..)를 담당
		 * 2) View : 화면을 담당(뷰(View : JSP)의 경로)
		 */
		ModelAndView mav = new ModelAndView();
//	      <beans:property name="prefix" value="/WEB-INF/views/" />
//	      <beans:property name="suffix" value=".jsp" />
		// prefix(접두어) : /WEB-INF/views/
		// suffix(접미어) : .jsp
		// /WEB-INF/views/ + book/create + .jsp
		// forwarding
		mav.setViewName("book/create");

		return mav;
	}

	// 책 입력 화면 -- 실습 1 끝

	// 실습 2 시작
	/*
	 * 요청URI : /createPost 요청파라미터(HTTP파라미터) : {title=개똥이의 모험, category=소설,
	 * price=12000} 요청방식 : post
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	public ModelAndView createPost(BookVO bookVO, ModelAndView mav) {
		log.info("createPost bookVO(전)" + bookVO);

		// JPA(Java Persistence API) : 엔티티(Book)가 리턴
		// MyBatis : insert/update/delete 시 return 타입은 int
		// BOOK 테이블에 도서를 등록
		int result = this.bookService.createPost(bookVO);

		log.info("createPost bookVO(후)" + bookVO);
		log.info("createPost result : " + result);

		// redirect : URI 를 재요청
		mav.setViewName("redirect:/detail?bookId=" + bookVO.getBookId());

		return mav;

	}

	// 실습 2 끝

	// 실습 3 시작
	/*
	 * 도서 상세페이지 요청URI : /detail?bookId=5 요청파라미터 : bookId=5 요청방식 : get
	 */
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	public ModelAndView detail(BookVO bookVO, ModelAndView mav) {
		/*
		 * BookVO(bookId=5, title=null, category=null, price=0, insertDate=null)
		 */
		log.info("detail->bookVO : " + bookVO);

		// 상세 데이터 불러오기
		// SELECT * FROM BOOK WHERE BOOK_ID = 5;
		bookVO = this.bookService.detail(bookVO);

		/*
		 * BookVO(bookId=5, title=개똥이의 모험5, category=소설, price=15000,
		 * insertDate=25/08/27)
		 */
		log.info("detail->bookVO(후) : " + bookVO);

		mav.addObject("bookVO", bookVO);

		// forwarding : jsp
		// application.properties => 설정
		// View Resolver가 조립을 해줌
		// /WEB-INF/views/ + book/detail + .jsp
		mav.setViewName("book/detail");

		return mav;
	}
	// 실습 3 끝

	// 실습 4 시작
	/*
	 * 요청URI : /modify?bookId=3 요청파라미터 : bookId=3 요청방식 : get
	 */
	@RequestMapping(value = "/modify", method = RequestMethod.GET)
	public ModelAndView modify(BookVO bookVO, ModelAndView mav) {
		log.info("modify bookVO :" + bookVO);

		// 상세 불러오기
		bookVO = this.bookService.detail(bookVO);

		// model 에 담기(속성명 : bookVO)
		mav.addObject("bookVO", bookVO);

		// fowarding
		mav.setViewName("/book/modify");

		return mav;

	}
	// 실습 4 끝

	// 실습 5 시작
	/*
	 * 도서 수정 요청URI : /modifyPost 요청파라미터 : request{title=개똥이
	 * 모험55,category=소설,price=15000} 요청방식 : post
	 * 
	 */
	@RequestMapping(value = "/modifyPost", method = RequestMethod.POST)
	public ModelAndView modifyPost(BookVO bookVO, ModelAndView mav) {
		/*
		 * BookVO(bookId=0, title=개똥이의 모험5, category=소설, price=15000 , insertDate=null)
		 */
		log.info("modifyPost->bookVO : " + bookVO);

		/*
		 * UPDATE BOOK SET TITLE=..,CATEGORY=..,PRICE=..,INSERT_DATE=SYSDATE WHERE
		 * BOOK_ID=3;
		 */

		// update 실행
		int result = this.bookService.modifyPost(bookVO);
		log.info("modifyPost->result : " + result);

		// 상세 페이지 URI를 재요청
		mav.setViewName("redirect:/detail?bookId=" + bookVO.getBookId());
		return mav;
	}

	// 실습 5 끝

	// 실습 6 시작
	/*
	 * 도서 삭제 요청URI : /deletePost 요청파라미터 : request{bookId=5, title=개똥이의 모험5,
	 * category=소설, price=15000, insertDate=} 요청방식 : post
	 */
	@RequestMapping(value = "/deletePost", method = RequestMethod.POST)
	public ModelAndView deletePost(BookVO bookVO, ModelAndView mav) {
		log.info("deletePost->bookVO : " + bookVO);

		// 삭제 실행
		int result = this.bookService.deletePost(bookVO);
		log.info("deletePost->result : " + result);

		// 목록 페이지 URI를 재요청
		mav.setViewName("redirect:/list");
		return mav;
	}
	// 실습 6 끝

	// 실습 7,8(검색파라미터 Map으로 전달) 시작
	/*
	 * 요청URI : /list?keyword=개똥이 or /list or /list?keyword= 요청파라미터 : keyword=개똥이
	 * 요청방식 : get required(true/false) : 필수 여부 defaultValue = "" : 기본 값이 null 이 아닌
	 * 공백으로 처리
	 */
	@RequestMapping("/list")
	public ModelAndView list(ModelAndView mav,
			@RequestParam(value = "keyword", required = false, defaultValue = "") String keyword,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage) {
		log.info("keyword : " + keyword);

		// 한 화면에 보여질 행의 개수
		int size = 10;

		Map<String, Object> map = new HashMap<>();
		map.put("keyword", keyword);
		map.put("currentPage", currentPage);
		log.info("map : " + map);
		/*
		 * [] : List () : VO
		 */
		List<BookVO> bookVOList = this.bookService.list(map);
		log.info(bookVOList.toString());

		// 전체 행의 수(keyword가 있을 시 조건 결과 행의 수)
		int total = this.bookService.getTotal(map);

		// 페이징 객체 등장!
		ArticlePage<BookVO> articlePage = new ArticlePage<>(total, currentPage, size, bookVOList, keyword);
		
		log.info("articlePage" + articlePage);

		mav.addObject("bookVOList", bookVOList);
		mav.addObject("articlePage", articlePage);
		// fowarding
		mav.setViewName("/book/list");
		return mav;
	}

	// 실습 7,8(검색파라미터) 끝
}
