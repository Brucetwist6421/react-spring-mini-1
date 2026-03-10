package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import kr.or.ddit.vo.SubjectDailyLogVO;

public interface SubjectDailyLogService {
    List<SubjectDailyLogVO> getDailyLogList(Integer subSeq, String logDate);

    void saveDailyLogs(List<SubjectDailyLogVO> logs, MultipartFile attachFile);
}
