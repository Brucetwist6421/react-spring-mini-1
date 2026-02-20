package kr.or.ddit.controller;

import kr.or.ddit.service.AccountService;
import kr.or.ddit.vo.AccountVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/{accSeq}")
    public AccountVO getAccountDetail(@PathVariable Integer accSeq) {
        return accountService.getAccountDetail(accSeq);
    }
}