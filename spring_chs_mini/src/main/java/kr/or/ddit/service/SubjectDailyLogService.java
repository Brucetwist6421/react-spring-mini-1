package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.ddit.vo.SubjectDailyLogVO;

public interface SubjectDailyLogService {
    List<SubjectDailyLogVO> getDailyLogList(Integer curSeq, String logDate);

    void saveDailyLogs(List<SubjectDailyLogVO> logs, MultipartHttpServletRequest request);

    /**
     * 출석 기록 삭제
     * @param attendanceSeq 삭제할 일련번호
     * @return 삭제 성공 여부
     */
    boolean deleteAttendance(Integer attendanceSeq);
}
