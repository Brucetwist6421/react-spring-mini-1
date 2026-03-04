package kr.or.ddit.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.mapper.AccountMapper;
import kr.or.ddit.service.AccountService;
import kr.or.ddit.service.FileService;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountMapper accountMapper;
	private final FileService fileService; // 공통 파일 업로드 서비스 의존성 주입

    @Override
    public List<AccountVO> getStudentsByCurriculum(Integer curSeq) {
        List<AccountVO> accountList = accountMapper.selectStudentsByCurriculum(curSeq);
        // 첨부파일 정보도 함께 조회하여 VO에 세팅 (필요 시)
		// if (accountList != null && !accountList.isEmpty()) {
		// 	for (AccountVO vo : accountList) {
		// 		List<AccountAttachmentVO> attachments = accountMapper.selectAttachmentsByAccountSeq(vo.getAccountSeq());
		// 		if (attachments != null && !attachments.isEmpty()) {
		// 			vo.setAttachments(attachments);
		// 		}
		// 	}
		// }
		return accountList;
    }

    @Override
    public AccountVO getAccountDetail(Integer accountSeq) {
        return accountMapper.selectAccountDetail(accountSeq);
    }

    @Override
    @Transactional
    public void updateAccount(AccountVO accountVO, MultipartFile mainImage) {
        try {
            // 1. 메인 이미지가 변경 된 경우에만 실행
			if (mainImage != null && !mainImage.isEmpty()) {
				String mainImagePath = fileService.saveMainImage(mainImage);
				accountVO.setMainImagePath(mainImagePath);
			}
            // 2. 학생 정보 업데이트 (Mapper 호출)
            int result = accountMapper.updateAccount(accountVO);
            
            if (result > 0) {
                log.info("회원 정보 수정 완료: {}", accountVO.getAccountSeq());
            }

        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류 발생", e);
        }
    }

    @Override
    @Transactional
    public void registerStudent(AccountVO accountVO, MultipartFile mainImage) {
        try {
			// 1. 메인 이미지 저장 후 VO에 세팅
			String mainImagePath = fileService.saveMainImage(mainImage);
			accountVO.setMainImagePath(mainImagePath);

			// 2. Account insert
			accountMapper.insertAccount(accountVO);
			// Long accountId = accountVO.getAccountSeq(); // insert 후 생성된 ID

			// 3. 첨부파일 저장
			// saveAttachments(accountId, accountVO.getName(), accountVO.getAttachmentFiles());

		} catch (IOException e) {
			throw new RuntimeException("createAccount 실패", e);
		}
        
    }
}