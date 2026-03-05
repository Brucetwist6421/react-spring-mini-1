package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.LmsDashboardService;
import kr.or.ddit.vo.LmsDashboardVO;
import kr.or.ddit.vo.LmsStudentScoreVO;
import lombok.RequiredArgsConstructor;

@Tag(name = "LmsDashboard", description = "LMS 대시보드 관련 API")
@RestController
@RequestMapping("/api/lmsDashboard")
@RequiredArgsConstructor
public class LmsDashboardController {
    private final LmsDashboardService dashboardService;

    @Operation(summary = "LMS 대시보드 통계 조회", description = "LMS 대시보드에 필요한 통계 데이터를 조회합니다. 연도별로 필터링 가능합니다.")
    @GetMapping("/stats")
    public ResponseEntity<List<LmsDashboardVO>> getStats(@Parameter(description = "조회할 연도") @RequestParam(required = false) String year) {
        // year가 없으면 전체, 있으면 해당 연도 조회
        return ResponseEntity.ok(dashboardService.getLmsDashboardStats(year));
    }

    @Operation(summary = "학생 성적 조회", description = "특정 교육과정에 대한 학생들의 성적 정보를 조회합니다.")
    @GetMapping("/student-stats/{curSeq}")
    public ResponseEntity<List<LmsStudentScoreVO>> getStudentStats(@Parameter(description = "교육과정 시퀀스") @PathVariable Integer curSeq) {
        return ResponseEntity.ok(dashboardService.getStudentScoresByCurriculum(curSeq));
    }
}
