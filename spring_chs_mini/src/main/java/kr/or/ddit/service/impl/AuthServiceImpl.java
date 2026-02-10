package kr.or.ddit.service.impl;

import kr.or.ddit.service.AuthService;
import kr.or.ddit.mapper.MemberMapper; // UserMapper에서 MemberMapper로 명칭 통일 권장
import kr.or.ddit.vo.LoginRequestVO;
import kr.or.ddit.vo.LoginResponseVO;
import kr.or.ddit.vo.MemberVO;
import kr.or.ddit.config.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public LoginResponseVO authenticate(LoginRequestVO loginVO) {
        // 1. 유저 조회
        MemberVO user = memberMapper.findByEmail(loginVO.getEmail());

        if (user == null) {
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        // 2. 비밀번호 확인 (DB 필드명 password에 맞춤)
        if (!passwordEncoder.matches(loginVO.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 토큰 생성 및 반환
        String token = jwtProvider.createToken(user.getEmail());
        return new LoginResponseVO(token, user.getEmail(), user.getNickname(), user.getMemType());
    }
}