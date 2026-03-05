package kr.or.ddit.service.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private final BCryptPasswordEncoder passwordEncoder; // 암호화 객체 주입

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
            // 1. 비밀번호 초기화 처리 (추가)
            // 프론트에서 '1234'를 보냈다면 암호화해서 VO에 다시 세팅
            if (accountVO.getAccountPasswd() != null && !accountVO.getAccountPasswd().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(accountVO.getAccountPasswd());
                accountVO.setAccountPasswd(encodedPassword);
                log.info("비밀번호 암호화 완료 (대상: {})", accountVO.getAccountSeq());
            }

            // 2. 메인 이미지가 변경 된 경우에만 실행
            if (mainImage != null && !mainImage.isEmpty()) {
                String mainImagePath = fileService.saveMainImage(mainImage);
                accountVO.setMainImagePath(mainImagePath);
            }

            // 3. 학생 정보 업데이트 (Mapper 호출)
            int result = accountMapper.updateAccount(accountVO);
            
            if (result > 0) {
                log.info("회원 정보 수정 완료: {}", accountVO.getAccountSeq());
            } else {
                // 업데이트 실패 시 예외를 던져야 Transactional이 롤백됩니다.
                throw new RuntimeException("회원 정보 업데이트에 실패했습니다.");
            }

        } catch (IOException e) {
            throw new RuntimeException("파일 저장 중 오류 발생", e);
        }
    }

    @Override
    @Transactional
    public void registerStudent(AccountVO accountVO, MultipartFile mainImage) {
        try {
            // 1. 비밀번호 암호화 (복호화 불가능한 해시화)
            if (accountVO.getAccountPasswd() != null && !accountVO.getAccountPasswd().isEmpty()) {
                String encodedPw = passwordEncoder.encode(accountVO.getAccountPasswd());
                accountVO.setAccountPasswd(encodedPw);
            }

			// 1. 메인 이미지 저장 후 VO에 세팅
			String mainImagePath = fileService.saveMainImage(mainImage);
			accountVO.setMainImagePath(mainImagePath);
            
            accountVO.setStatus("A"); // 신규 등록 시 상태 'A'로 설정 (Active)

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