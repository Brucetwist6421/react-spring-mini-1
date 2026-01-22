package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.MemberVO;
import kr.or.ddit.vo.TblUsersVO;

@Mapper
public interface TblUsersMapper {

//	public TblUsersVO findByEmail(String email);
	
	// 실습 2 진행 -- 위 메서드 주석처리
	public MemberVO findByEmail(String email);
	// 실습 2 끝

}
