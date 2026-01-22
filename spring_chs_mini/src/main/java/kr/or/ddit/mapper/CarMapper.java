package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.CarVO;

@Mapper
public interface CarMapper {
	public String create(CarVO carVO); 
	
	public String detail(CarVO carVO);
	
	public String update(CarVO carVO); 
	
	public String delete(CarVO carVO);
	
	public String list(CarVO carVO);

	// 실습 1 시작
	public int createPostAjax(CarVO carVO);
	// 실습 1 끝
}
