package kr.or.ddit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.or.ddit.vo.AttendanceVO;

public interface AttendanceService {
    AttendanceVO getStudentAttendanceRate(int accountSeq);

    void insertAttendance(List<AttendanceVO> attendanceVO, MultipartHttpServletRequest request);
}
