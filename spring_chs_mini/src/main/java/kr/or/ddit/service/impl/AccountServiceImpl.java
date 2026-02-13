package kr.or.ddit.service.impl;

import kr.or.ddit.mapper.AccountMapper;
import kr.or.ddit.service.AccountService;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountMapper accountMapper;

    @Override
    public List<AccountVO> getStudentsByCurriculum(Integer curSeq) {
        return accountMapper.selectStudentsByCurriculum(curSeq);
    }
}