package kr.or.ddit.service.impl;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 추가

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
    @Transactional // 토큰 업데이트를 위해 트랜잭션 추가
    public LoginResponseVO authenticate(LoginRequestVO loginVO) {
        // 1. 유저 조회
        AccountVO user = accountMapper.findByAccId(loginVO.getAccId());

        if (user == null) {
            log.error("DB에 해당 ID를 가진 유저가 없습니다: {}", loginVO.getAccId());
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(loginVO.getPassword(), user.getAccountPasswd())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 토큰 생성
        String token = jwtProvider.createToken(user.getAccountId());
        log.info("새로 발급된 토큰: {}", token);
        log.info("유저 ID: {}", user.getAccountId());

        // 4. [중복 로그인 방지 핵심] DB에 발급된 최신 토큰 업데이트
        // mapper에 updateCurrentToken(String accountId, String token) 메서드가 있어야 합니다.
        accountMapper.updateCurrentToken(user.getAccountId(), token);
        
        log.info("유저 [{}]의 새로운 토큰이 DB에 저장되었습니다.", user.getAccountId());

        // 5. 반환
        return new LoginResponseVO(
            token, 
            user.getAccountId(), 
            user.getAccountEmail(), 
            user.getAccountName(), 
            user.getAccountType()
        );
    }
}