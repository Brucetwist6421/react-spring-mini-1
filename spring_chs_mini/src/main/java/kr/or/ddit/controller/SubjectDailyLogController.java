package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.ddit.service.SubjectDailyLogService;
import kr.or.ddit.vo.SubjectDailyLogVO;
import lombok.RequiredArgsConstructor;

@Tag(name = "daily-log", description = "훈련일지 관련 API")
@RestController
@RequestMapping("/api/daily-log")
@RequiredArgsConstructor
public class SubjectDailyLogController {
    private final SubjectDailyLogService service;

    @Operation(summary = "훈련일지 조회", description = "특정 사용자가 특정 포켓몬을 즐겨찾기에 추가했는지 확인합니다.")
    @GetMapping("/{subSeq}")
    public ResponseEntity<List<SubjectDailyLogVO>> getDailyLogList(
            @PathVariable Integer subSeq,
            @RequestParam(required = false) String logDate) {
        return ResponseEntity.ok(service.getDailyLogList(subSeq, logDate));
    }
}