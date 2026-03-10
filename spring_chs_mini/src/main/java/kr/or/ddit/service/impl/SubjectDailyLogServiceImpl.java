package kr.or.ddit.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    public void saveDailyLogs(List<SubjectDailyLogVO> logs, MultipartFile attachFile) {
        String filePath = null;
        
        try {
        // 1. 파일이 존재할 경우 파일 서비스 호출 (기존에 작성하신 파일 처리 로직 활용)
        if (attachFile != null && !attachFile.isEmpty()) {
            filePath = fileService.saveMainImage(attachFile);
        }

        // 2. 각 로그 데이터에 공통 파일 경로 세팅 및 DB Upsert
        for (SubjectDailyLogVO log : logs) {
            if (filePath != null) {
                log.setMainFilePath(filePath);
            }
            // regId는 시큐리티 세션 등에서 가져와 설정하는 것이 좋습니다.
            mapper.upsertDailyLog(log);
        }
        } catch (IOException e) {
            throw new RuntimeException("Failed to save daily logs", e);
        }
    }
}