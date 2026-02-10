package kr.or.ddit.service;

import kr.or.ddit.vo.LoginRequestVO;
import kr.or.ddit.vo.LoginResponseVO;

public interface AuthService {
    /**
     * 사용자 인증 및 JWT 토큰 발급
     * @param loginVO 로그인 요청 정보 (email, password)
     * @return 로그인 응답 정보 (token, email, nickname)
     */
    LoginResponseVO authenticate(LoginRequestVO loginVO);
}