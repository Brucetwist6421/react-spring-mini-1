package kr.or.ddit.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.CustVO;

@Mapper
public interface CustMapper {
	public String create(CustVO custVO); 
	
	public String detail(CustVO custVO);
	
	public String update(CustVO custVO); 
	
	public String delete(CustVO custVO);
	
	public String list(CustVO custVO);

	// 실습 1 시작
	public int createPost(CustVO custVO);
	// 실습 1 끝

	// 실습 2 시작
	public List<CustVO> getList();
	// 실습 2 끝
}
