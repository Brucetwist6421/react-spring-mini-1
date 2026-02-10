// package kr.or.ddit.controller;

// import kr.or.ddit.service.AuthService;
// import kr.or.ddit.vo.LoginRequestVO;
// import kr.or.ddit.vo.LoginResponseVO;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// @RequiredArgsConstructor
// public class AuthController {

//     private final AuthService authService;

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequestVO loginVO) {
//         try {
//             // 실제 서비스 로직 호출
//             LoginResponseVO response = authService.authenticate(loginVO);
//             return ResponseEntity.ok(response);
//         } catch (RuntimeException e) {
//             // 로그인 실패 시 (비밀번호 틀림, 유저 없음 등) 401 Unauthorized 반환
//             // 에러 메시지를 포함하여 리액트에서 alert()으로 띄울 수 있게 합니다.
//             return ResponseEntity
//                     .status(HttpStatus.UNAUTHORIZED)
//                     .body(e.getMessage());
//         }
//     }
// }