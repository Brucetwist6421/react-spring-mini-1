package kr.or.ddit.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component // Bean으로 등록하여 다른 서비스에서 의존성 주입(DI) 가능
public class FileService {

    // application.yml 또는 application.properties에 설정된 경로를 사용
    // 설정이 없을 경우 기본값으로 /home/ubuntu/upload/ 사용
    @Value("${file.upload-path:/home/ubuntu/upload/}")
    private String uploadPath;

    /**
     * 파일 저장 공통 로직
     * @param file 업로드된 파일 (MultipartFile)
     * @return 저장된 유니크한 파일명 (DB 저장용)
     * @throws IOException 파일 쓰기 실패 시 발생
     */
    public String saveMainImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 1. 디렉토리 생성 확인 (폴더가 없으면 전체 경로 생성)
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            if (uploadDir.mkdirs()) {
                log.info("업로드 디렉토리 생성 완료: {}", uploadPath);
            }
        }

        // 2. 파일명 중복 방지를 위한 UUID 활용 파일명 생성
        String originalFileName = file.getOriginalFilename();
        String savedName = UUID.randomUUID() + "_" + originalFileName;

        // 3. 파일 물리적 저장
        File targetFile = new File(uploadPath, savedName);
        file.transferTo(targetFile);

        log.info("파일 저장 완료: {} (원본명: {})", savedName, originalFileName);
        return savedName;
    }

}