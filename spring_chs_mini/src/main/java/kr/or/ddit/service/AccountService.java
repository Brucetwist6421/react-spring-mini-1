package kr.or.ddit.service;

import java.util.List;

import kr.or.ddit.vo.AccountVO;

public interface AccountService {
    List<AccountVO> getStudentsByCurriculum(Integer curSeq);

    AccountVO getAccountDetail(Integer accountSeq);
}
