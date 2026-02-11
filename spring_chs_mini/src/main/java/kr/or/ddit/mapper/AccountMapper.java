package kr.or.ddit.mapper;

import org.apache.ibatis.annotations.Mapper;

import kr.or.ddit.vo.AccountVO;

@Mapper // 마이바티스 매퍼임을 명시
public interface AccountMapper {
    
    /**
     * 이메일로 계정 정보 조회
     * @param email 사용자 이메일
     * @return AccountVO (비밀번호 포함)
     */
    AccountVO findByAccId(String email);
}