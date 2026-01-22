package kr.or.ddit.config;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.stereotype.Component;

// 스프링 프레임워크에서 자바빈 객체로 미리 등록
@Component
public class BeanController {

	// 파일이 업로드 되는 윈도우 경로
	private String uploadFolder = "C:\\upload";
	// 연 월 일
	private String folder = "";

	// 연 월 일 폴더 생성
	public String getFolder() {
		// 2025-02-21 형식(format) 지정
		// 간단 날짜 형식
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		// 날짜 객체 생성(java.util 패키지)
		Date date = new Date();
		String str = sdf.format(date);
		// str : 2026-03-21 -> 2026\\03\\21
//		return str.replace("-", "\\"); 같은 표현식
		return str.replace("-", File.separator);
	}

	public String getUploadFolder() {
		return uploadFolder;
	}

}
