package kr.or.ddit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

// 스프링에게 설정 파일임을 알려주자
@Configuration
@Slf4j
public class FileConfig implements WebMvcConfigurer {
	/*
	 * 웹 주소와 파일의 위치 매핑 
	 * 주소줄에 이렇게 쓰면 /upload/2025/02/20/개똥이.jpg
	 * D:/springboot/upload/2025/02/20/개똥이.jpg
	 */
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 브라우저에서 /upload/** 로 들어오는 모든 요청을 가로챕니다.
        registry.addResourceHandler("/upload/**")
                // 2. 실제 리눅스 서버의 물리적 경로와 연결합니다.
                // file:/ 형식으로 시작해야 하며 끝에 반드시 /를 붙여야 합니다.
                .addResourceLocations("file:///home/ubuntu/upload/");
    }
}
