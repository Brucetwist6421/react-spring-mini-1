package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.ddit.vo.AttendanceVO;

public interface AttendanceService {
    AttendanceVO getStudentAttendanceRate(int accountSeq);

    void insertAttendance(List<AttendanceVO> attendanceVO, MultipartHttpServletRequest request);

    List<AttendanceVO> getDailyAttendanceList(int curSeq, String attendanceDate);

    AttendanceVO getTodayAttendanceStats(String date);

    /**
     * 출석 기록 삭제
     * @param attendanceSeq 삭제할 일련번호
     * @return 삭제 성공 여부
     */
    boolean deleteAttendance(Integer attendanceSeq);
}
