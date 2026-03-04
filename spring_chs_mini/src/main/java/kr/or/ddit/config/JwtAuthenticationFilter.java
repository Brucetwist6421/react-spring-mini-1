package kr.or.ddit.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.mapper.AccountMapper; // 추가
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final AccountMapper accountMapper; // 1. Mapper 주입 추가

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 요청 헤더에서 JWT 토큰 추출
        String token = resolveToken(request);

        // 2. 토큰이 있고 유효하다면
        if (token != null && jwtProvider.validateToken(token)) {
            
            // [중복 로그인 체크 로직 추가 시작]
            String accountId = jwtProvider.getAccountId(token); // 토큰에서 ID 추출
            String savedToken = accountMapper.getCurrentToken(accountId); // DB 최신 토큰 조회
            log.info("요청 토큰: {}", token);
            log.info("DB 저장 토큰: {}", savedToken);
            log.info("계정 ID: {}", accountId);
            // DB에 저장된 토큰이 없거나, 현재 토큰과 다르다면 (다른 곳에서 로그인함)
            if (savedToken == null || !savedToken.equals(token)) {
                sendErrorResponse(response, "DUPLICATE_LOGIN", "다른 기기에서 로그인하여 접속이 종료되었습니다.");
                return; //  더 이상 진행하지 않고 여기서 응답 종료
            }
            // [중복 로그인 체크 로직 추가 끝]

            Authentication auth = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            
        } else if (token != null) {
            logger.info("유효하지 않은 토큰 요청: " + request.getRequestURI());
        }

        filterChain.doFilter(request, response);
    }

    // 3. 에러 메시지를 JSON 형태로 깔끔하게 보내주는 도우미 메서드
    private void sendErrorResponse(HttpServletResponse response, String code, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 에러
        response.setContentType("application/json;charset=UTF-8");
        
        // React에서 파싱하기 쉽게 JSON 구조로 작성
        String json = String.format("{\"code\":\"%s\", \"message\":\"%s\"}", code, message);
        response.getWriter().write(json);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}