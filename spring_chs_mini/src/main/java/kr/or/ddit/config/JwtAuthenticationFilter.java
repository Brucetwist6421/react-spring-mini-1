package kr.or.ddit.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.or.ddit.mapper.AccountMapper;
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
    private final AccountMapper accountMapper;

    /**
     * 특정 경로에 대해서는 이 필터가 동작하지 않도록 설정합니다. (화이트리스트)
     * SecurityConfig의 permitAll 설정과 일치시켜주는 것이 좋습니다.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        
        // 1. 주식 API (현재 401 에러 해결의 핵심)
        // 2. 인증 관련 (로그인, 회원가입 등)
        // 3. 포켓몬 관련 리소스
        // 4. Swagger 및 정적 리소스
        return path.startsWith("/api/stock") || 
               path.startsWith("/api/auth") || 
               path.startsWith("/pokemon") ||
               path.startsWith("/v3/api-docs") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/upload");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 요청 헤더에서 JWT 토큰 추출
        String token = resolveToken(request);

        // 2. 토큰이 있고 유효하다면 (shouldNotFilter에 해당하지 않는 보안이 필요한 경로들만 일로 들어옵니다)
        if (token != null && jwtProvider.validateToken(token)) {
            
            // [중복 로그인 체크 로직]
            String accountId = jwtProvider.getAccountId(token); 
            String savedToken = accountMapper.getCurrentToken(accountId); 
            
            log.info("요청 경로: {}", request.getRequestURI());
            log.info("계정 ID: {}, DB 저장 토큰 존재 여부: {}", accountId, savedToken != null);

            // DB에 저장된 토큰이 없거나, 현재 토큰과 다르다면 (다른 기기에서 로그인함)
            if (savedToken == null || !savedToken.equals(token)) {
                log.warn("중복 로그인 감지 - 계정: {}", accountId);
                sendErrorResponse(response, "DUPLICATE_LOGIN", "다른 기기에서 로그인하여 접속이 종료되었습니다.");
                return; 
            }

            Authentication auth = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            
        } else if (token != null) {
            log.info("유효하지 않은 토큰 요청 (만료 등): " + request.getRequestURI());
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    // 에러 메시지를 JSON 형태로 깔끔하게 보내주는 도우미 메서드
    private void sendErrorResponse(HttpServletResponse response, String code, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json;charset=UTF-8");
        
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