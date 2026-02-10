package kr.or.ddit.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import java.util.Collections;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {
    // 1. 비밀키는 최소 32글자 이상이어야 HS256 알고리즘에 적합합니다.
    // 실무에서는 application.properties나 환경변수에 두고 불러오는 것이 좋습니다.
    private String secret = "your-256-bit-secret-key-for-jwt-authentication-12345-secure";
    private Key key;
    private final long validityInMilliseconds = 3600000; // 1시간

    // 객체 생성 후 키를 초기화합니다.
    @PostConstruct
    protected void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String createToken(String email) {
        // 2. 최신 버전에서는 Jwts.claims() 대신 builder를 바로 사용하거나
        // Claims 객체를 명시적으로 생성하는 것을 권장합니다.
        Claims claims = Jwts.claims().setSubject(email);

        // 추가 정보(권한 등)를 넣고 싶다면 이렇게 추가 가능합니다.
        // claims.put("role", "USER");

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                // 3. 최신 버전에서는 signWith(key, SignatureAlgorithm.HS256) 형태를 사용합니다.
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰이 유효한지(만료되지 않았는지) 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 토큰에서 사용자 정보를 꺼내 시큐리티 인증 객체 생성
    public Authentication getAuthentication(String token) {
        String email = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();

        // 권한은 우선 빈 리스트로 설정 (필요시 DB의 memType 추가)
        User principal = new User(email, "", Collections.emptyList());
        return new UsernamePasswordAuthenticationToken(principal, token, Collections.emptyList());
    }
}