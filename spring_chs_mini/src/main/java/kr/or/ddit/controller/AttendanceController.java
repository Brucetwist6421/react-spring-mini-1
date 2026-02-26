package kr.or.ddit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.service.AttendanceService;
import kr.or.ddit.vo.AttendanceVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping("/status/{accountSeq}")
    public ResponseEntity<AttendanceVO> getAttendanceStatus(@PathVariable int accountSeq) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceRate(accountSeq));
    }
}
