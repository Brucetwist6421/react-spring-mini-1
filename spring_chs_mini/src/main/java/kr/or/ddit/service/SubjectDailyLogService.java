package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.ddit.vo.SubjectDailyLogVO;

public interface SubjectDailyLogService {
    List<SubjectDailyLogVO> getDailyLogList(Integer curSeq, String logDate);

    void saveDailyLogs(List<SubjectDailyLogVO> logs, MultipartHttpServletRequest request);
}
