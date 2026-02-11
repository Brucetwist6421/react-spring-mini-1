package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.ddit.service.LmsDashboardService;
import kr.or.ddit.vo.LmsDashboardVO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lmsDashboard")
@RequiredArgsConstructor
public class LmsDashboardController {
    private final LmsDashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<List<LmsDashboardVO>> getStats(@RequestParam(required = false) String year) {
        // year가 없으면 전체, 있으면 해당 연도 조회
        return ResponseEntity.ok(dashboardService.getLmsDashboardStats(year));
    }
}
