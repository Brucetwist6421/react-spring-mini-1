package kr.or.ddit.service.impl;

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
                    // 케이스 1: 새 파일이 업로드 됨 -> 새 경로로 업데이트
                    String filePath = fileService.saveMainImage(file);
                    log.setMainFilePath(filePath);
                } 
                else if (log.isFileDeleted()) { 
                    // 케이스 2: 사용자가 명시적으로 '삭제'를 누름 -> null로 업데이트
                    log.setMainFilePath(null);
                }
                else {
                    // 케이스 3: 새 파일도 없고 삭제도 안 함 -> 기존 경로 유지
                    // 이 경우 log.getMainFilePath()에 기존 값이 들어있어야 합니다.
                    // 만약 VO에 값이 없다면 MyBatis 쿼리에서 null일 때 업데이트를 제외해야 합니다.
                }
                
                mapper.upsertDailyLog(log);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public boolean deleteAttendance(Integer attendanceSeq) {
        // 실제 운영 시에는 파일 서비스(fileService)를 호출하여 
        // 해당 레코드의 main_file_path에 있는 실제 물리 파일도 삭제하는 로직을 추가하는 것이 좋습니다.
        return attendanceMapper.deleteAttendance(attendanceSeq) > 0;
    }
}