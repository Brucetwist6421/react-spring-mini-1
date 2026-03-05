package kr.or.ddit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.AttendanceService;
import kr.or.ddit.vo.AttendanceVO;
import lombok.RequiredArgsConstructor;

@Tag(name = "Attendance", description = "출석 관련 API")
@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @Operation(summary = "학생 출석 정보 조회", description = "특정 학생의 출석률을 조회합니다.")
    @GetMapping("/status/{accountSeq}")
    public ResponseEntity<AttendanceVO> getAttendanceStatus(@Parameter(description = "계정 시퀀스") @PathVariable int accountSeq) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceRate(accountSeq));
    }
}
