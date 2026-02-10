package kr.or.ddit.mapper;

import kr.or.ddit.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper // 마이바티스 매퍼임을 명시
public interface MemberMapper {
    
    /**
     * 이메일로 회원 정보 조회
     * @param email 사용자 이메일
     * @return MemberVO (비밀번호 포함)
     */
    MemberVO findByEmail(String email);
}