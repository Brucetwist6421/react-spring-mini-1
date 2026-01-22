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
		log.debug("=====addResourceHandlers 실행======");
		registry.addResourceHandler("/upload/**")
				.addResourceLocations("file:///C:/upload/");
	}
}
