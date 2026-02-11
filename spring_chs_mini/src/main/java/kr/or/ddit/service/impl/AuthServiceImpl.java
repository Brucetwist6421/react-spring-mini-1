package kr.or.ddit.service.impl;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import kr.or.ddit.config.JwtProvider;
import kr.or.ddit.mapper.AccountMapper;
import kr.or.ddit.service.AuthService;
import kr.or.ddit.vo.AccountVO;
import kr.or.ddit.vo.LoginRequestVO;
import kr.or.ddit.vo.LoginResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AccountMapper accountMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public LoginResponseVO authenticate(LoginRequestVO loginVO) {
        // 1. 유저 조회
        AccountVO user = accountMapper.findByAccId(loginVO.getAccId());

        if (user != null) {
            log.info("리액트가 보낸 비번: [{}]", loginVO.getPassword());
            log.info("DB에서 가져온 비번: [{}]", user.getAccountPasswd());
            log.info("java 진짜 암호문: {}", passwordEncoder.encode("java"));
        } else {
            log.error("DB에 해당 ID를 가진 유저가 없습니다.");
        }

        if (user == null) {
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        // 2. 비밀번호 확인 (DB 필드명 password에 맞춤)
        if (!passwordEncoder.matches(loginVO.getPassword(), user.getAccountPasswd())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 토큰 생성 및 반환
        String token = jwtProvider.createToken(user.getAccountId());
        return new LoginResponseVO(token, user.getAccountId(), user.getAccountEmail(), user.getAccountName(), user.getAccountType());
    }
}