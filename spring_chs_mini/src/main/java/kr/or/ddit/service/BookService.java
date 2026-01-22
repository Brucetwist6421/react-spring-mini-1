package kr.or.ddit.service;

import java.util.List;
import java.util.Map;

import kr.or.ddit.vo.BookVO;

public interface BookService {

	//BOOK 테이블에 도서를 등록
	public int createPost(BookVO bookVO);

	//상세 데이터 불러오기
	public BookVO detail(BookVO bookVO);

	//update 실행
	public int modifyPost(BookVO bookVO);

	public int deletePost(BookVO bookVO);
	
	public List<BookVO> list(Map<String, Object> map);

	public int getTotal(Map<String, Object> map);
}
