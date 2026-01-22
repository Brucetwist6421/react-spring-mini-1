package kr.or.ddit.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

	@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 실제 배포된 서버의 IP 주소를 추가해야 합니다.
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",          // 로컬 개발용
            "http://168.107.51.143",          // 배포된 리액트 서버 IP
            "http://168.107.51.143:80"        // 80포트 명시 (선택사항)
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT"));
        configuration.setAllowCredentials(true);
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 API 허용

        return source;
    }
}
