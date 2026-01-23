package kr.or.ddit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer { // WebMvcConfigurer를 구현합니다.

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 경로에 대해
                .allowedOrigins(
                    "http://localhost:5173", 
                    "http://168.107.51.143", 
                    "http://168.107.51.143:80"
                ) // 허용할 도메인들
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true) // 쿠키/인증정보 포함 허용
                .maxAge(3600); // 프리플라이트 요청 캐싱 시간
    }
}