package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.AccountService;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "Account", description = "계정 관련 API")
@Slf4j
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    //과정 별 학생 목록 조회
    @Operation(summary = "과정 별 학생 목록 조회", description = "특정 교육과정에 등록된 학생 목록을 조회합니다.")
    @GetMapping("/{curSeq}/students")
    public ResponseEntity<List<AccountVO>> getStudentsByCurriculum(@Parameter(description = "과정 시퀀스") @PathVariable Integer curSeq) {
        return ResponseEntity.ok(accountService.getStudentsByCurriculum(curSeq));
    }

    //계정 상세조회
    @Operation(summary = "계정 상세 조회", description = "특정 계정의 상세 정보를 조회합니다.")
    @GetMapping("/{accountSeq}")
    public AccountVO getAccountDetail(@Parameter(description = "계정 시퀀스") @PathVariable Integer accountSeq) {
        return accountService.getAccountDetail(accountSeq);
    }

    //학생 정보 수정
    @Operation(summary = "학생 정보 수정", description = "특정 학생의 정보를 수정합니다. (프로필 이미지 포함)")
    @PutMapping("update/{accountSeq}") 
    public ResponseEntity<?> updateAccount(
            @Parameter(description = "계정 시퀀스") @PathVariable Integer accountSeq, // URL의 ID를 받음
            @Parameter(description = "계정 데이터") @RequestPart("accountData") AccountVO accountVO, // JSON 데이터
            @Parameter(description = "프로필 이미지") @RequestPart(value = "mainImage", required = false) MultipartFile mainImage // 키 이름 통일
    ) {
        log.info("수정 요청 ID: {}, 데이터: {}", accountSeq, accountVO);
        
        try {
            // 안전을 위해 URL의 ID를 VO에 세팅
            accountVO.setAccountSeq(accountSeq); 
            accountService.updateAccount(accountVO, mainImage);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("Update failed", e);
            return ResponseEntity.status(500).body("fail");
        }
    }

    //학생 등록
    @Operation(summary = "학생 등록", description = "새로운 학생 계정을 등록합니다. (프로필 이미지 포함)")
    @PostMapping("/register")
    public ResponseEntity<String> registerAccount(
            @Parameter(description = "프로필 이미지") @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @Parameter(description = "계정 데이터") @RequestPart(value = "accountData") AccountVO accountData) {
        
        try {
            accountService.registerStudent(accountData, mainImage);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
        }
    }

    @Operation(summary = "교사 계정 목록 조회", description = "teacher_yn이 'Y'인 모든 교사 목록을 조회합니다.")
    @GetMapping("/teachers")
    public ResponseEntity<List<AccountVO>> getTeacherList() {
        return ResponseEntity.ok(accountService.getTeacherList());
    }

    // 아이디 중복 체크
    @Operation(summary = "아이디 중복 체크", description = "입력된 아이디의 사용 가능 여부를 확인합니다.")
    @GetMapping("/check-id/{accountId}")
    public ResponseEntity<java.util.Map<String, Boolean>> checkIdDuplicate(
            @Parameter(description = "체크할 아이디") @PathVariable String accountId) {
        
        boolean isDuplicate = accountService.checkIdDuplicate(accountId);
        
        java.util.Map<String, Boolean> response = new java.util.HashMap<>();
        response.put("isDuplicate", isDuplicate);
        
        return ResponseEntity.ok(response);
    }
}