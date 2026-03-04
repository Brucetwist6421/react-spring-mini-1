package kr.or.ddit.controller;

import kr.or.ddit.service.AccountService;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    //과정 별 학생 목록 조회
    @GetMapping("/{curSeq}/students")
    public ResponseEntity<List<AccountVO>> getStudentsByCurriculum(@PathVariable Integer curSeq) {
        return ResponseEntity.ok(accountService.getStudentsByCurriculum(curSeq));
    }

    //계정 상세조회
    @GetMapping("/{accountSeq}")
    public AccountVO getAccountDetail(@PathVariable Integer accountSeq) {
        return accountService.getAccountDetail(accountSeq);
    }

    //학생 정보 수정
    @PutMapping("update/{accountSeq}") 
    public ResponseEntity<?> updateAccount(
            @PathVariable Integer accountSeq, // URL의 ID를 받음
            @RequestPart("accountData") AccountVO accountVO, // JSON 데이터
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage // 키 이름 통일
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
    @PostMapping("/register")
    public ResponseEntity<String> registerAccount(
            @RequestPart(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestPart(value = "accountData") AccountVO accountData) {
        
        try {
            accountService.registerStudent(accountData, mainImage);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
        }
    }
}