package kr.or.ddit.controller;

import kr.or.ddit.service.AuthService;
import kr.or.ddit.vo.LoginRequestVO;
import kr.or.ddit.vo.LoginResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestVO loginVO) {
        try {
            // 1. 리액트에서 보낸 데이터가 VO에 잘 담겼는지 확인 
            log.info("로그인 요청 데이터 - Account ID: {}, Password: {}", loginVO.getAccountId(),
                    (loginVO.getPassword() != null ? "입력됨" : "NULL!!!"));

            // 2. 실제 서비스 로직 호출
            LoginResponseVO response = authService.authenticate(loginVO);

            log.info("로그인 성공: {}", loginVO.getAccountId());
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // 3. 서버 콘솔에 구체적인 에러 원인 출력 (비번 불일치 여부 등)
            log.error("로그인 실패 원인: {}", e.getMessage());

            // 실패 시 스택 트레이스를 찍어보면 어느 줄에서 에러가 났는지 알 수 있습니다.
            // e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}