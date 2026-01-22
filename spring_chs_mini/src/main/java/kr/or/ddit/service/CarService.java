package kr.or.ddit.service;

import kr.or.ddit.vo.CarVO;

public interface CarService {
	public String create(CarVO carVO); 
	
	public String detail(CarVO carVO);
	
	public String update(CarVO carVO); 
	
	public String delete(CarVO carVO);
	
	public String list(CarVO carVO);
	
	// 실습 1 시작
	public int createPostAjax(CarVO carVO);
	// 실습 1 끝
}
