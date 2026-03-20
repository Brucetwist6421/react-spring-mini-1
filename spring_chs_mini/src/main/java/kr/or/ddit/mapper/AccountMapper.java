package kr.or.ddit.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.ddit.vo.AccountAttachmentVO;
import kr.or.ddit.vo.AccountVO;

@Mapper // 마이바티스 매퍼임을 명시
public interface AccountMapper {
    
    /**
     * 이메일로 계정 정보 조회
     * @param email 사용자 이메일
     * @return AccountVO (비밀번호 포함)
     */
    AccountVO findByAccId(String email);

    void updateCurrentToken(@Param("accountId") String accountId, @Param("token") String token);
    
    String getCurrentToken(@Param("accountId") String accountId); // 나중에 Filter에서 대조할 때 사용

    List<AccountVO> selectStudentsByCurriculum(Integer curSeq);

    AccountVO selectAccountDetail(Integer accountSeq);

    List<AccountAttachmentVO> selectAttachmentsByAccountSeq(Integer accountSeq);

    int updateAccount(AccountVO accountVO);

    int insertAccount(AccountVO accountVO);

    List<AccountVO> selectTeacherList();

    int checkIdDuplicate(String accountId);

    int deleteAccount(Integer accountSeq);
}