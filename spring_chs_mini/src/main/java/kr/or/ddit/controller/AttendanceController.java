package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    @PostMapping(value = "/insert")
    public ResponseEntity<String> insertAttendance(
            @RequestPart(value = "attendance") String attendanceJson,
            MultipartHttpServletRequest request) { // 파일 처리를 위해 추가
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<AttendanceVO> attendanceVO = mapper.readValue(attendanceJson, new TypeReference<List<AttendanceVO>>(){});
            
            // 서비스에서 파일 저장 로직(기존 훈련일지와 동일하게) 호출
            attendanceService.insertAttendance(attendanceVO, request);
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
        }
    }

    @Operation(summary = "과정별 일자별 출석 목록 조회", description = "특정 과정의 특정 날짜 출석 현황을 조회합니다.")
    @GetMapping("/list/{curSeq}")
    public ResponseEntity<List<AttendanceVO>> getDailyAttendanceList(
            @PathVariable int curSeq,
            @RequestParam String logDate) { // YYYY-MM-DD 형식
        return ResponseEntity.ok(attendanceService.getDailyAttendanceList(curSeq, logDate));
    }

    @Operation(summary = "대시보드 실시간 출석 통계", description = "오늘 또는 특정 날짜의 상태별 통계 및 학생 명단을 조회합니다.")
    @GetMapping("/attendance-today/list")
    public ResponseEntity<AttendanceVO> getAttendanceToday(
            @RequestParam(value = "date", required = false) String date) {
        // date가 null이면 서비스 레이어에서 오늘 날짜로 처리
        return ResponseEntity.ok(attendanceService.getTodayAttendanceStats(date));
    }

    @Operation(summary = "출석 기록 삭제", description = "출석 일련번호(seq)를 이용해 특정 출석 기록을 삭제합니다.")
    @DeleteMapping("/{attendanceSeq}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Integer attendanceSeq) {
        try {
            boolean isDeleted = attendanceService.deleteAttendance(attendanceSeq);
            if (isDeleted) {
                return ResponseEntity.ok("Success");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Data not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
        }
    }
}
