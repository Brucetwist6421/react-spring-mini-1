package kr.or.ddit.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
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
            // 1. 비밀번호 처리 (기존과 동일)
            if (accountVO.getAccountPasswd() != null && !accountVO.getAccountPasswd().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(accountVO.getAccountPasswd());
                accountVO.setAccountPasswd(encodedPassword);
            }

            // 2. 이미지 처리 로직 (보완)
            if (mainImage != null && !mainImage.isEmpty()) {
                // [Case A] 새 이미지 업로드
                String mainImagePath = fileService.saveMainImage(mainImage);
                accountVO.setMainImagePath(mainImagePath);
            } else {
                // 새 파일이 들어오지 않은 경우
                if (accountVO.getMainImagePath() == null || accountVO.getMainImagePath().isEmpty()) {
                    // [Case B] 삭제 버튼을 눌러서 null이 온 경우
                    // XML에서 main_image_path = #{mainImagePath} 로 되어있으므로 DB에 NULL이 저장됨
                    accountVO.setMainImagePath(null); 
                    log.info("기존 이미지 삭제 처리");
                } else {
                    // [Case C] 기존 이미지 유지
                    // 프론트에서 넘어온 기존 경로(studentData.mainImagePath)를 그대로 유지함.
                    // 만약 프론트에서 경로를 보내지 않는 구조라면, 여기서 DB 조회를 통해 
                    // 기존 경로를 다시 세팅해줘야 데이터가 유실되지 않습니다.
                    log.info("기존 이미지 유지: {}", accountVO.getMainImagePath());
                }
            }

            // 3. 업데이트 실행
            accountVO.setUpdateDate(LocalDateTime.now());
            int result = accountMapper.updateAccount(accountVO);
            
            if (result <= 0) {
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
            
			// 2. Account insert
            // 삭제 여부 N 삽입
            accountVO.setDelYn("N");
			accountMapper.insertAccount(accountVO);
			// Long accountId = accountVO.getAccountSeq(); // insert 후 생성된 ID

			// 3. 첨부파일 저장
			// saveAttachments(accountId, accountVO.getName(), accountVO.getAttachmentFiles());

		} catch (IOException e) {
			throw new RuntimeException("createAccount 실패", e);
		}
        
    }

    @Override
    public List<AccountVO> getTeacherList() {
        return accountMapper.selectTeacherList();
    }

    @Override
    public boolean checkIdDuplicate(String accountId) {
        // 결과가 0보다 크면 중복(true)
        return accountMapper.checkIdDuplicate(accountId) > 0;
    }

    @Override
    @Transactional
    public int deleteAccount(Integer accountSeq) {
        log.info("학생 정보 논리 삭제 시작 - accountSeq: {}", accountSeq);
        return accountMapper.deleteAccount(accountSeq);
    }
}