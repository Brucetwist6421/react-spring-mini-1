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
}
