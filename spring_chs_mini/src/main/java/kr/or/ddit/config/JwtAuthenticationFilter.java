package kr.or.ddit.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 요청 헤더에서 JWT 토큰 추출
        String token = resolveToken(request);

        // 2. 토큰이 있고 유효하다면 인증 객체 생성
        if (token != null && jwtProvider.validateToken(token)) {
            // JwtProvider에 인증 객체를 생성하는 메서드가 필요합니다. (아래 2단계 참고)
            Authentication auth = jwtProvider.getAuthentication(token);
            // SecurityContext에 인증 정보 저장 (이후 컨트롤러에서 사용자 확인 가능)
            SecurityContextHolder.getContext().setAuthentication(auth);
        } else if (token != null) {
            // 디버깅용 로그: 토큰은 보냈는데 검증에 실패한 경우
            logger.info("유효하지 않은 토큰 요청: " + request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}