package kr.or.ddit.exception;

import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

import lombok.extern.slf4j.Slf4j;

//스프링 컨트롤러에서 발생하는 예외를 처리하는 핸들러 클래스임을 명시함
@Slf4j
@ControllerAdvice
public class CommonExceptionHandler {

	/**
	 * 괄호 안에 설정한 예외 타입을 해당 메서드가 처리한다는 의미
		IOException, SQLException, NullPointerException, ArrayIndexOutOfBoundsException,
		ArtimeticException(0으로 나눌경우)
	 */
	@ExceptionHandler(Exception.class)
	public String handle(Exception e, Model model) {
		log.error("CommonExceptionHandler->handle : {}", e.toString());
		
		model.addAttribute("exception",e);
		
		//forwarding : jsp
		return "error/errorCommon";
	}
	
	/**404 오류 처리
	 *
	404를 프로그래밍적으로 처리하고 싶다면 404 발생 시 예외를 발생시키도록 설정해야 한다.
	(기본적으로 404는 exception 상황이 아니다.) 
	이를 위해 applicatino.properties에서 DispatcherServlet을 등록할 때 throwExceptionIfNoHandlerFound 
	초기화 파라미터를 true로 설정한다.
	 */
	@ExceptionHandler(NoHandlerFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public String handle404(Exception e) {
		log.error("CommonExceptionHandler->handle : {}",e.toString());
		
		//forwarding
		return "error/error404";
	}
	
	/**500 Internal Server Error 처리
	 * 모든 포괄적인 예외 (명시적으로 처리되지 않은 RuntimeException 포함)를 처리합니다.
	 *  500 Internal Server Error**는 이미 ExceptionHandler(Exception.class)를 통해 처리하며,
	 *   별도의 application.properties 설정이 필요 없음
	 */
	@ExceptionHandler(RuntimeException.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public String handle500(Exception e) {
		log.error("CommonExceptionHandler->handle500 : 서버 내부 오류 발생 {}", e);
		
		//forwarding
		return "error/error500";
	}
	
	
	/**
     * 400 Bad Request 처리: DTO 유효성 검사 (@Valid) 실패 시
     * 클라이언트 요청 데이터의 유효성 검사 실패나 형식 오류 때문에 발생하며, 
     * 이는 Spring MVC의 DispatcherServlet 내부 로직에서 발생하는 
     * 예외(MethodArgumentNotValidException, HttpMessageNotReadableException 등)를 통해 처리
     * @param ex MethodArgumentNotValidException
     * @return 400 상태 코드와 유효성 검사 실패 정보를 담은 JSON 응답
     */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handle400(Exception e) {
		log.error("CommonExceptionHandler->handle400 : {}", e);
		
		//forwarding
		return "error/error400";
	}
}





