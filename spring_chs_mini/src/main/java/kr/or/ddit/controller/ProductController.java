package kr.or.ddit.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.or.ddit.config.SecurityConfig;
import kr.or.ddit.service.ProductService;
import kr.or.ddit.vo.BookVO;
import kr.or.ddit.vo.ProductVO;
import lombok.extern.slf4j.Slf4j;

//프링이에게 "이거 컨트롤러야. 그니까, 자바빈으로 등록해줘야해"
//클래스레벨
@Controller
@Slf4j
public class ProductController {

    private final SecurityConfig securityConfig;

	// 실습 5 시작
	// DI : Dependency Injection(의존성 주입)
	@Autowired
	ProductService productService;

    ProductController(SecurityConfig securityConfig) {
        this.securityConfig = securityConfig;
    }
	// 실습 5 끝

	// 메소드레벨
	// 골뱅이RequestMapping(value="/product/welcome",method=RequestMethod.GET)
	/*
	 * 요청URI => /localhost/product/welcome 요청파라미터 : 요청방식 : get
	 */
	@RequestMapping(value = "/product/welcome", method = RequestMethod.GET)
	public ModelAndView welcome(ModelAndView mav) {

		// 실습 2 시작
		List<BookVO> bookVOList = new ArrayList<BookVO>();

		List<Map<String, Object>> hobbyMapList = new ArrayList<Map<String, Object>>();

		Map<String, Object> hobbyMap = new HashMap<String, Object>();
		hobbyMap.put("baseball", "야구");
		hobbyMap.put("basketball", "농구");
		hobbyMap.put("swimming", "수영");

		BookVO book1 = new BookVO();
		book1.setBookId(1);
		book1.setTitle("개똥이의 여행");
		bookVOList.add(book1);

		BookVO book2 = new BookVO();
		book2.setBookId(2);
		book2.setTitle("개똥이의 여행2");
		bookVOList.add(book2);

		mav.addObject("bookVOList", bookVOList);
		mav.addObject("hobbyMap", hobbyMap);
		// 실습 2 끝

		// 실습 3 시작
		String isLogin = "Y";
		mav.addObject("isLogin", isLogin);
		// 실습 3 끝

		// 실습 4 시작
		String auth = "ROLE_ADMIN";
//		String auth = "ROLE_MEMBER";
		mav.addObject("auth", auth);
		// 실습 4 끝

		mav.setViewName("product/welcome");

		return mav;
	}

	/*
	 * 요청URI => /localhost/product/scriptlet 요청파라미터 : 요청방식 : get
	 */
	@RequestMapping(value = "/product/scriptlet", method = RequestMethod.GET)
	public ModelAndView scriptlet(ModelAndView mav) {
		// fowarding : jsp 응답
		mav.setViewName("product/scriptlet");

		return mav;
	}

	// 실습 5 시작
	// 상품 목록
	/*
	 * 요청URI : /product/products 
	 * 요청파라미터 : 
	 * 요청방식 : get
	 */
	@RequestMapping(value = "/product/products", method = RequestMethod.GET)
	public String products(Model model) {
		// 상품 목록
		List<ProductVO> productVOList = this.productService.products();
		log.info("productVOList : "+ productVOList);
		model.addAttribute("productVOList", productVOList);
		
		return "product/products";
	}
	// 실습 5 끝
	
	// 실습 6 진행
	/*상품상세 
	   요청URI : /product/product?productId=P1234
	   요청파라미터 : productId=P1234
	   요청방식 : get
	   
	   1) VO 타입의 매개변수
	   2) String 타입의 매개변수 @RequestParam을 생략 가능
	   3) Map 타입의 매개변수 -> @RequestParam을 꼭 사용
	*/
	@GetMapping("/product/product")
	public String product(ProductVO productVO,
			@RequestParam(value = "productId") String productId,
			@RequestParam Map<String, Object> map,
			Model model) {
		
		 log.info("product->productVO : " + productVO);
	     log.info("product->productId : " + productId);
	     log.info("product->map : " + map);
	      
	     //상품 상세 -- 실습 7 시작
	     productVO = this.productService.product(productVO);
	     log.info("product->productVO(결과) : " + productVO);
	     model.addAttribute("productVO", productVO);
	     //상품 상세 -- 실습 7 끝	      
	     
	     // 실습 15 시작
	     if(productVO == null) {
	         // 없는 상품일 경우 예외 페이지로 리다이렉트
	    	 return "redirect:/product/exceptionNoProductId?productId="+productId;
	     }
	     // 실습 15 끝
	     
	     //forwarding : jsp 응답
	     return "product/product";
	}
	// 실습 6 끝
	
	// 실습 11 시작
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	// 실습 11 끝
	// 실습 8 시작
	@GetMapping("/product/addProduct")
	public String addProduct() {
		
		//fowarding
		return "product/addProduct";
	}
	// 실습 8 끝
	
	// 실습 9 시작
	/*요청URI : /product/processAddProduct
	  요청파라미터 : request{productId=P1234,pname=삼성노트북..}
	  요청방식 : post
	*/
	@PostMapping("/product/processAddProduct")
	public String processAddProduct(ProductVO productVO) {
		log.info("productVO : " + productVO);
		
		// 실습 10 시작
		int result = this.productService.processAddProduct(productVO);
		log.info("result : " + result);
		// 실습 10 끝
		
		//상세로 이동
		return "redirect:/product/product?productId="+productVO.getProductId();
	}
	
	// 실습 9 끝
	
	// 실습 12 시작
	/* 장바구니 확인
    * 요청URI : /product/cart
    * 요청파라미터 : 
    * 요청방식 : get
    */
	@GetMapping("/product/cart")
	public String cart(HttpSession session, Model model) {
      //1. 세션의 고유 아이디(장바구니 번호). 하나의 웹브라우저
		String cartId = session.getId();
		log.info("cart->cartId : " + cartId);
      
      //[세션 생성 연습]
      /*
      세션의 속성을 설정하면 계속 세션 상태를 유지할 수 있음
      만약 동일한 세션의 속성 이름으로 세션을 생성하면 마지막에 설정한 것이 세션 속성 값이 됨
      첫 번째 매개변수 name은 세션으로 사용할 세션 속성 이름을 나타내며, 세션에 저장된 특정 값을 찾아오기 위한 키로 사용
      두 번째 매개변수 value는 세션의 속성 값
      세션 속성 값은 Object 객체 타입만 가능하기 때문에 int, double, char 등의 기본 타입은 사용할 수 없음
       */
      
      //2. 장바구니(세션) => 세션명 : cartlist 불러오기
		List<ProductVO> list = (List<ProductVO>) session.getAttribute("cartlist");
		log.info("cart-list : " + list);
      
		
      //3. model에 장바구니에 담겨있는 상품 목록을 매핑
		model.addAttribute("list",list);
		//cartId
		model.addAttribute("cartId",cartId);

      
      //4. forwarding : /product/cart.jsp
      //데이터(x), view 경로 => 리턴타입은 String 또는 ModelAndView
		
		return "product/cart";
	}
	// 실습 12 끝
	
	// 실습 13 시작
	/*
	   요청URI : /product/addCart
	   요청파라미터 : request{productId=P1234}
	   요청방식 : post
    */
	@PostMapping("/product/addCart")
	public String addCart(ProductVO productVO, HttpSession session) {
		log.info("addCart->productVO : " + productVO);
		
		//0. 개똥이가 P1234 상품을 사러 마트에 옴(요구사항)
		String productId = productVO.getProductId();
	    
		//1. 기본키인 P1234 코드의 상품이 DB에 있는지 찾아보자
	    //productVO{productId=P1234,pname=null,..}
	    ProductVO productVODB = this.productService.product(productVO);
		
	    //2.1) 상품 결과가 없다면...
	    if(productVODB==null) {
	       //[상품이 없음]예외처리 요청으로 이동
	    	return "redirect:/product/exceptionNoProductId?productId="+productId;
	    }
	    //2.2) 
	      
	    //3. 장바구니(세션) 가져오기 => 세션명 : cartlist
	    List<ProductVO> list = (List<ProductVO>) session.getAttribute("cartlist");  
	    //4. 장바구니가 없다면 생성
	       //list는 null이므로 여기서 리스트를 생성
	       //cartlist라는 세션명으로 세팅
	    if(list==null) {
	    	list = new ArrayList<ProductVO>();
	    	
	    	session.setAttribute("cartlist", list);
	    }
	            
	    //5. 장바구니가 있다면 다음을 실행
	    int cnt = 0;
	    //1)장바구니에 P1234 상품이 이미 들어있는 경우
	    //    private int quantity;   //상품을 장바구니에 담은 개수
	    //   quantity를 1 증가
	    for(int i=0; i<list.size();i++) {
	    	
	       //list.get(0).getProductId() : P1234 는 장바구니에 들어있는 상품
	       //list.get(0).getProductId().equals(productId(장바구니에 추가할 대상 상품))
	    	if(list.get(i).getProductId().equals(productId)) { //장바구니에 추가하려는 상품이 이미 있다면
	    		cnt++;
	    		//장바구니에 동일한 상품이 추가됨
	    		list.get(i).setQuantity(list.get(i).getQuantity()+1);
	    	}
	    }

	    //2)장바구니에 P1234 상품이 없는 경우
	    //  장바구니에 상품을 넣어주고
	    //   quantity를 1로 처리
	    //6. 장바구니에 해당 상품이 없다면
	    //최종목표 : 장바구니(list)에 상품을 추가
	    //장바구니에 동일한 상품이 없음
	    if(cnt==0) {
	    	productVODB.setQuantity(1);
	       //장바구니.추가(검증된 상품 1개가)
	    	list.add(productVODB);
	    }
	    //7. 장바구니 확인
	    //list : ArrayList<ProductVO>
	    //   3) 상품 하나   2)중에서 하나를 꺼내면   1)여러개 상품들
	    for(ProductVO pd : list) {
	    	log.info("pd : " + pd);
	    }
		
		return "redirect:/product/product?productId=" + productVO.getProductId();
//	    return list;
	}
	
	// 실습 13 끝
	
	// 실습 14 시작
	//DB에 장바구니에 담을 상품 아이디가 없을 경우 예외 처리
    // /product/exceptionNoProductId
	@GetMapping("/product/exceptionNoProductId")
	public String exceptionNoProductId(String productId) {
		
		return "product/exceptionNoProductId";
	}
	// 실습 14 끝
	
	// 실습 16 시작
	@GetMapping("/product/removeCart")
	public String removeCart(
			@RequestParam(value = "productId", required = true) String productId,
			HttpSession session) {
		log.info("removeCart->productId : " + productId);
		
		//1. 장바구니에서 제외할 그 대상 상품(productId)이 DB에 있는지 체킹
	    ProductVO productVO = new ProductVO();
	    productVO.setProductId(productId);
	      
	    ProductVO productVODB = this.productService.product(productVO);
	    log.info("removeCart->productVODB : " + productVODB);  
	    
	    //해당 상품이 DB에 없으면 예외 처리
	    if(productVODB == null) {
	    	return "redirect:product/exceptionNoProductId";
	    }
	    //2. 세션의 장바구니(세션) 목록에서 ex) P1236이 있는지 체크한 후 
	    // 만약에 있다면 장바구니에서 제외처리
	    //cartlist라는 세션명으로 생성      
	    //session.setAttribute("cartlist", list);
	    List<ProductVO> list = (List<ProductVO>) session.getAttribute("cartlist");
	    log.info("removeCart->list : " + list);  
	      
	    for(int i =0; i<list.size(); i++) {
	       //list : List<ProductVO>
	       //list.get(i) : ProductVO
	       //list.remove(list.get(1))
	       // 장바구니의 상품 1행.(의)기본키.equals(와 같은) 제외 대상 상품 기본키
	    	if(list.get(i).getProductId().equals(productId)) {
	    		list.remove(list.get(i));
	    	}
	    }
	    //3. "P1236".equals("P1236") => 해당 상품이 장바구니에 있다면..
	    //list.remove(list.get(i));   //성공
	      
	    //4. redirect : 새로운 URI로 재요청(/product/cart)
		return "redirect:/product/cart";
	}
	// 실습 16 끝
	
	// 실습 17 시작
	@GetMapping("/product/deleteCart")
	public String deleteCart(
			@RequestParam(value = "cartId", required = true) String cartId, HttpSession session) {
		log.info("removeCart->cartId : " + cartId);
		
		//1. cartId가 없네? => /product/cart로 이동
	    // /product/deleteCart 또는 /product/deleteCart?cartId=
	    if(cartId==null || cartId.trim().equals("")) {
	    	return "redirect:/product/cart";
	    }
		
	    //2. !session.getId().equals(cartId)
	    // /product/list 로 이동
	    if(!session.getId().equals(cartId)) {
	    	return "redirect:/product/products";
	    }
	      
	    //3. 장바구니 비우기
	    //세션 속성 한 건만 삭제
	    //List<ProductVO> list = (List<Product>)session.getAttribute("cartlist")
	    //session.setAttribute("cartlist", list);
	    session.removeAttribute("cartlist");
	      
	    //session.invalidate(); //모든 세션의 속성을 삭제(로그아웃)
	      
	    //장바구니 페이지로 이동(새로운 URI로 재요청 : redirect)
	    return "redirect:/product/cart";
	}
	
	// 실습 17 끝
	
	// 실습 18 시작
	/*
   요청URI : /product/shippingInfo?cartId=900B88F67ACDF2764696A4295D5FD0A2
   요청파라미터 : cartId=900B88F67ACDF2764696A4295D5FD0A2
   요청방식 : get
    */
   @GetMapping("/product/shippingInfo")
   public String shippingInfo(
      @RequestParam(value="cartId",required=true) String cartId,
      HttpSession session,
      HttpServletRequest request,
      Model model
         ) {
      log.info("cartId : " + cartId);//model.addAttribute("cartId","ASDFDFS");
      log.info("sessionId : " + session.getId());//session의 세션ID
      
      Cookie[] cookies = request.getCookies();//cookie의 JSESSIONID
      for(Cookie ck : cookies) {
         log.info("쿠키명 : " + ck.getName() + ", 쿠키값 : " + ck.getValue());
      }
      
      //cartId 검증
      if(!session.getId().equals(cartId)) {
         return "redirect:/product/products";
      }
      
      model.addAttribute("cartId", cartId);
      
      //forwarding : jsp 응답
      return "product/shippingInfo";
   }
	// 실습 18 끝
	
	// 실습 19 시작
	//취소
   // /product/checkOutCancelled
   @GetMapping("/product/checkOutCancelled")
   public String checkOutCancelled(HttpSession session) {
      
      //기존 세션 제거 후 세션이 새로 생성됨 => 로그아웃
      //session.invalidate();
      //기존 세션 유지하면서 cartlist라는 세션속성명만 제거 => 로그인 유지
      session.removeAttribute("cartlist");
      
      //forwarding : checkOutCancelled.jsp를 응답
      return "product/checkOutCancelled";
   }
   // 실습 19 끝
   
   // 실습 20 시작
   /* 1. 배송정보 6요소를 쿠키 6객체에 넣음
    * 2. 세션에서 장바구니 상품 목록을 꺼냄
   요청URI : /product/processShippingInfo
   요청파라미터 : request{cartId=ABCDE,name=개똥이,shippingDate=2025-02-11,
                  zipCode=06112,addressName=서울 강남구 논현로123길 4-1,
                  addressDetName=123} 
   요청방식 : post
    */
   @PostMapping("/product/processShippingInfo")
   public String processShippingInfo(
		HttpServletRequest request,
		HttpServletResponse response, Model model,
		HttpSession session
		   ) throws UnsupportedEncodingException {
	   
	   Enumeration en = request.getParameterNames();
	   
	   String paramName ="";
	   
	   int cnt = 0;
	   
	   Cookie[] cookies = new Cookie[6];
	   
	   while(en.hasMoreElements()) {
		   paramName = (String)en.nextElement();
		   log.info("paramName : " + paramName);
		   log.info("value : " + request.getParameter(paramName));
		   
		   cookies[cnt] = new Cookie("Shipping" + paramName,
				   URLEncoder.encode(request.getParameter(paramName), "UTF-8"));
		   cookies[cnt].setMaxAge(24 * 60 * 60); //초 -> 24시간
		   
		   //응답객체(response)에 넣어서 크롬의 쿠키저장소에 넣기
		   response.addCookie(cookies[cnt]);
		   cnt++;
	   }
	   
	   List<ProductVO> list = (List<ProductVO>) session.getAttribute("cartlist");
	   
	   model.addAttribute("list", list);
	   
	   return "product/orderConfirmation";
   }
   // 실습 20 끝
   
   
	
		
	
}
