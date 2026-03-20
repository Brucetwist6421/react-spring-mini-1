package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.vo.AccountVO;

public interface AccountService {
    public List<AccountVO> getStudentsByCurriculum(Integer curSeq);

    public AccountVO getAccountDetail(Integer accountSeq);

    public void updateAccount(AccountVO accountVO, MultipartFile mainImage);

    public void registerStudent(AccountVO accountVO, MultipartFile mainImage);

    public List<AccountVO> getTeacherList();

    boolean checkIdDuplicate(String accountId);

    /**
     * 계정 논리 삭제 (del_yn = 'Y')
     * @param accountSeq 계정 시퀀스
     * @return 반영된 행의 수
     */
    int deleteAccount(Integer accountSeq);
}
