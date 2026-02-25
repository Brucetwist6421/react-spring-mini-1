package kr.or.ddit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.or.ddit.mapper.AccountMapper;
import kr.or.ddit.service.AccountService;
import kr.or.ddit.vo.AccountAttachmentVO;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountMapper accountMapper;

    @Override
    public List<AccountVO> getStudentsByCurriculum(Integer curSeq) {
        List<AccountVO> accountList = accountMapper.selectStudentsByCurriculum(curSeq);
		if (accountList == null || accountList.isEmpty()) {
			for (AccountVO vo : accountList) {
				List<AccountAttachmentVO> attachments = accountMapper.selectAttachmentsByAccountSeq(vo.getaccountSeq());
				if (attachments != null && !attachments.isEmpty()) {
					vo.setAttachments(attachments);
				}
			}
		}
		return accountList;
    }

    @Override
    public AccountVO getAccountDetail(Integer accountSeq) {
        return accountMapper.selectAccountDetail(accountSeq);
    }
}