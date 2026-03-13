package kr.or.ddit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @Operation(summary = "출석 정보 등록", description = "새로운 출석/외출 정보를 등록합니다.")
    @PostMapping("/insert")
    public ResponseEntity<String> insertAttendance(@Parameter(description = "출석 정보") @RequestBody AttendanceVO attendanceVO) {
        int result = attendanceService.insertAttendance(attendanceVO);
        return result > 0 ? ResponseEntity.ok("Success") : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
    }
}
