package kr.or.ddit.service;

import kr.or.ddit.vo.AttendanceVO;

public interface AttendanceService {
    AttendanceVO getStudentAttendanceRate(int accountSeq);

    int insertAttendance(AttendanceVO attendanceVO);
}
