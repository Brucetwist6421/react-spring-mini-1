package kr.or.ddit.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.ddit.mapper.SubjectDailyLogMapper;
import kr.or.ddit.service.FileService;
import kr.or.ddit.service.SubjectDailyLogService;
import kr.or.ddit.vo.SubjectDailyLogVO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectDailyLogServiceImpl implements SubjectDailyLogService {
    private final SubjectDailyLogMapper mapper;
    private final FileService fileService; // 공통 파일 업로드 서비스 의존성 주입

    @Override
        public List<SubjectDailyLogVO> getDailyLogList(Integer curSeq, String logDate) {

            Map<String, Object> params = new HashMap<>();
            params.put("curSeq", curSeq);
            params.put("logDate", logDate);
            return mapper.selectDailyLogList(params);
    }

    @Override
    @Transactional
    public void saveDailyLogs(List<SubjectDailyLogVO> logs, MultipartHttpServletRequest request) {
        try {
            Map<String, MultipartFile> fileMap = request.getFileMap();

            for (SubjectDailyLogVO log : logs) {
                String fileKey = "file_" + log.getPeriod();
                MultipartFile file = fileMap.get(fileKey);

                if (file != null && !file.isEmpty()) {
                    // 새 파일이 업로드된 경우 저장하고 경로 업데이트
                    String filePath = fileService.saveMainImage(file);
                    log.setMainFilePath(filePath);
                }
                // ★ 중요: 파일이 없는 경우, 기존 DB에 저장된 값을 그대로 쓰거나 null 유지
                // MyBatis의 upsert 쿼리에서 main_file_path가 null이면 업데이트하지 않도록
                // 쿼리를 수정하거나, 여기서 로직을 제어합니다.
                
                mapper.upsertDailyLog(log);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}