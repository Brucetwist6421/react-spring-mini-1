package kr.or.ddit.controller;

import kr.or.ddit.service.AccountService;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

    @GetMapping("/{curSeq}/students")
    public ResponseEntity<List<AccountVO>> getStudentsByCurriculum(@PathVariable Integer curSeq) {
        return ResponseEntity.ok(accountService.getStudentsByCurriculum(curSeq));
    }

    //계정 상세조회
    @GetMapping("/{accountSeq}")
    public AccountVO getAccountDetail(@PathVariable Integer accountSeq) {
        return accountService.getAccountDetail(accountSeq);
    }

    @PutMapping("/{accountSeq}") // URL 구조 맞춤
    public ResponseEntity<?> updateAccount(
        @RequestPart("accountData") AccountVO accountVO, // Blob(JSON) 매핑
        @RequestPart(value = "file", required = false) MultipartFile mainImage // 키 이름 맞춤
    ) {
        log.info("updateAccount -> accountVO: {}", accountVO);
        
        if (mainImage != null && !mainImage.isEmpty()) {
            log.info("updateAccount -> mainImage: {}", mainImage.getOriginalFilename());
        }

        try {
            accountService.updateAccount(accountVO, mainImage);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("Update failed", e);
            return ResponseEntity.status(500).body("fail");
        }
    }
}