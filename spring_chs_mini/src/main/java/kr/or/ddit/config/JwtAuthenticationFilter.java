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

        String path = request.getRequestURI();
        String token = resolveToken(request);

        // 1. 토큰이 있고 유효한 경우에만 인증 로직 수행
        if (token != null && jwtProvider.validateToken(token)) {
            String accountId = jwtProvider.getAccountId(token);
            String savedToken = accountMapper.getCurrentToken(accountId);

            // 🌟 중복 로그인 체크 (로그인이 필요한 서비스에서만 엄격하게 적용)
            // 만약 permitAll 경로라면 이 체크를 건너뛰도록 조건문을 걸 수 있습니다.
            boolean isPublicPath = path.startsWith("/api/account/") || path.startsWith("/api/auth/");

            if (!isPublicPath) { // 보호된 경로일 때만 중복 로그인 체크
                if (savedToken == null || !savedToken.equals(token)) {
                    sendErrorResponse(response, "DUPLICATE_LOGIN", "다른 기기에서 로그인하여 접속이 종료되었습니다.");
                    return; 
                }
            }

            // 인증 정보를 Context에 저장 (이게 있어야 authenticated() 경로 통과 가능)
            Authentication auth = jwtProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
            
        } else if (token != null) {
            log.info("유효하지 않은 토큰 혹은 만료된 토큰: {}", path);
            // 여기서 return을 하지 않고 filterChain.doFilter로 넘기는 것이 포인트!
        }

        // 마지막에 무조건 다음 필터로 넘겨줍니다. 
        // 여기서 SecurityConfig가 permitAll이면 통과시키고, authenticated인데 인증정보 없으면 401을 던집니다.
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