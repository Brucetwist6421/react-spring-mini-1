package kr.or.ddit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import kr.or.ddit.service.SubjectDailyLogService;
import kr.or.ddit.vo.SubjectDailyLogVO;
import lombok.RequiredArgsConstructor;

@Tag(name = "daily-log", description = "훈련일지 관련 API")
@RestController
@RequestMapping("/api/daily-log")
@RequiredArgsConstructor
public class SubjectDailyLogController {
    private final SubjectDailyLogService service;

    @Operation(summary = "훈련일지 조회", description = "특정 과정의 일자 별 훈련일지를 조회합니다.")
    @GetMapping("/curriculum/{curSeq}")
    public ResponseEntity<List<SubjectDailyLogVO>> getDailyLogList(
            @Parameter(description = "과정 일련번호") @PathVariable Integer curSeq,
            @Parameter(description = "일지 날짜") @RequestParam(required = false) String logDate) {
        return ResponseEntity.ok(service.getDailyLogList(curSeq, logDate));
    }

    @Operation(summary = "훈련일지 저장", description = "훈련일지 및 첨부파일을 저장합니다.")
    @PostMapping(value = "/save")
    public ResponseEntity<String> saveDailyLogs(
            @RequestPart(value = "logs") String logsJson,
            MultipartHttpServletRequest request) { // 단일 파일이 아닌 요청 전체를 받음
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<SubjectDailyLogVO> logs = mapper.readValue(logsJson, new TypeReference<List<SubjectDailyLogVO>>(){});
            
            service.saveDailyLogs(logs, request); // request를 서비스로 넘김
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Fail");
        }
    }

  
}